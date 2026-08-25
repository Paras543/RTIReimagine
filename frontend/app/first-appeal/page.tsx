"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";
import {
  Landmark,
  Gavel,
  Bot,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  FileText,
  Copy,
  Check,
  Info,
} from "lucide-react";

const APPEAL_GROUNDS = [
  {
    id: "incomplete_response",
    label: "Incomplete, Misleading, or Vague Information",
    description: "The CPIO provided partial details and omitted vital certified records without statutory justification.",
    defaultReason: "unsatisfactory_response",
  },
  {
    id: "no_response",
    label: "No Response Provided within 30-Day Mandatory Limit",
    description: "Statutory deadline elapsed without reply, constituting 'Deemed Refusal' under Section 7(2).",
    defaultReason: "no_response",
  },
  {
    id: "improper_exemption",
    label: "Improper Rejection under Section 8(1) Exemptions",
    description: "The CPIO improperly invoked commercial confidentiality or exemption clauses without showing public interest harm.",
    defaultReason: "unsatisfactory_response",
  },
  {
    id: "excessive_fee",
    label: "Unreasonable or Excessive Fee Demanded",
    description: "The additional calculation requested by the CPIO under Section 7(3) exceeds official RTI fee guidelines.",
    defaultReason: "unsatisfactory_response",
  },
];

function FirstAppealContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn } = useAuth();

  const queryRtiId = searchParams.get("id") || "RTI/2026/7829142";

  // Step 1: Appeal Form & Customization, Step 2: Confirmation & Receipt
  const [stage, setStage] = useState<1 | 2>(1);

  // Form State
  const [originalRtiNumber, setOriginalRtiNumber] = useState(queryRtiId);
  const [authorityName, setAuthorityName] = useState("Ministry of Road Transport and Highways");
  const [department, setDepartment] = useState("National Highways Authority of India (NHAI)");
  const [selectedGround, setSelectedGround] = useState("incomplete_response");

  const [questions, setQuestions] = useState<string[]>([
    "Total budget allocated for the road repair project in Sector 4.",
    "List of contractors who bid for the project and the final selected contractor.",
    "Copy of the quality inspection report conducted post-completion.",
  ]);

  const [appealBody, setAppealBody] = useState("");
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);

  // Appellant Contact Info (No hardcoded values; empty initial state)
  const [appellant, setAppellant] = useState({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    pincode: "",
  });

  const [declarationConfirmed, setDeclarationConfirmed] = useState(true);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<{
    appeal_id: string;
    original_rti_number: string;
    authority_name: string;
    submitted_date: string;
    receipt_id: string;
    message: string;
  } | null>(null);

  // Auto-generate Appeal Petition Draft when ground or parameters change
  useEffect(() => {
    const generateDraft = async () => {
      setIsGeneratingDraft(true);
      try {
        const activeGround = APPEAL_GROUNDS.find((g) => g.id === selectedGround);
        const res = await fetch("/api/proxy/appeal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            original_questions: questions,
            authority_name: authorityName,
            reason: activeGround?.defaultReason || "unsatisfactory_response",
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setAppealBody(data.text);
        } else {
          throw new Error("Fallback required");
        }
      } catch {
        const qList = questions.map((q, idx) => `${idx + 1}. ${q}`).join("\n");
        const fallbackText = `BEFORE THE FIRST APPELLATE AUTHORITY
Under Section 19(1) of the Right to Information Act, 2005

In the Matter of:
First Appeal against the CPIO, ${department}, ${authorityName}.
Original RTI Registration Number: ${originalRtiNumber}

1. Particulars of the Appellant:
Name: ${appellant.fullName || "[Appellant Name]"}
Contact: ${appellant.mobile ? "+91 " + appellant.mobile : "[Contact Mobile]"} | ${appellant.email || "[Email]"}
Address: ${appellant.address || "[Postal Address]"}

2. Facts & Grounds of Appeal:
The appellant had submitted an online RTI application on ${new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })} seeking specific public information. 

Ground: ${APPEAL_GROUNDS.find((g) => g.id === selectedGround)?.label}.
The CPIO failed to provide complete, certified information within the mandatory statutory period or improperly withheld vital records without invoking any permissible exemption under Section 8(1) of the RTI Act, 2005.

3. Specific Information Omitted / Denied:
${qList}

4. Prayer / Relief Sought:
The appellant respectfully prays that the First Appellate Authority may be pleased to:
(a) Direct the CPIO to furnish complete, certified copies of all requested documents free of charge forthwith;
(b) Initiate necessary inquiry under Section 20(1) for unexplained delay / denial of public records.

Date: ${new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
Signature of Appellant: _______________________`;
        setAppealBody(fallbackText);
      } finally {
        setIsGeneratingDraft(false);
      }
    };

    generateDraft();
  }, [selectedGround, authorityName, department, originalRtiNumber, questions]);

  // Submit First Appeal Handler
  const handleSubmitAppeal = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    const activeGround = APPEAL_GROUNDS.find((g) => g.id === selectedGround)?.label || "Incomplete Response";

    const payload = {
      original_rti_number: originalRtiNumber,
      authority_name: authorityName,
      department: department,
      ground_of_appeal: activeGround,
      appellant_name: appellant.fullName || "Citizen Appellant",
      email: appellant.email || "citizen@gov.in",
      mobile: appellant.mobile || "9876543210",
      address: appellant.address || "Central Secretariat Enclave, New Delhi",
      appeal_text: appealBody,
      original_questions: questions,
    };

    try {
      const res = await fetch("/api/proxy/appeal/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to submit First Appeal.");
      }

      const result = await res.json();
      setSubmissionResult(result);
      setStage(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setSubmitError(err.message || "An unexpected error occurred while lodging your appeal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Download Official Appeal Document
  const handleDownloadAppeal = () => {
    if (!submissionResult) return;
    const content = `=====================================================
RTI ONLINE - OFFICIAL FIRST APPEAL PETITION (SECTION 19(1))
Government of India | First Appellate Authority Registry
=====================================================
Appeal Reference ID : ${submissionResult.appeal_id}
Original RTI Number : ${submissionResult.original_rti_number}
Receipt Reference   : ${submissionResult.receipt_id}
Public Authority    : ${submissionResult.authority_name}
Lodge Date          : ${submissionResult.submitted_date}
Statutory Limit     : 30 to 45 Days (Section 19(6))
Fee Required        : ₹0.00 (Exempt under Central RTI Rules)

=====================================================
APPEAL PETITION CONTENT:
=====================================================
${appealBody}
=====================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `First_Appeal_${submissionResult.appeal_id.replace(/[/\\?%*:|"<>]/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased">
      {/* Top Header */}
      <header className="bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-50 shadow-xs">
        <div className="flex justify-between items-center px-4 md:px-8 w-full max-w-7xl mx-auto h-16">
          <Link href="/" className="font-headline-md text-xl font-bold text-primary flex items-center gap-2.5">
            <Landmark className="h-6 w-6 text-primary shrink-0" />
            <span>RTI Online</span>
          </Link>
          <nav className="hidden md:flex gap-6 items-center h-full">
            <Link className="text-on-surface-variant hover:text-primary transition-colors flex items-center h-full hover:bg-surface-container-low px-3 font-medium text-[15px]" href="/">
              Home
            </Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors flex items-center h-full hover:bg-surface-container-low px-3 font-medium text-[15px]" href="/file-rti">
              File RTI
            </Link>
            {isSignedIn ? (
              <Link className="text-on-surface-variant hover:text-primary transition-colors flex items-center h-full hover:bg-surface-container-low px-3 font-medium text-[15px]" href="/track">
                Track Status
              </Link>
            ) : (
              <SignInButton mode="modal">
                <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center h-full hover:bg-surface-container-low px-3 font-medium text-[15px] cursor-pointer">
                  Track Status
                </button>
              </SignInButton>
            )}
            <span className="text-primary font-bold border-b-2 border-secondary-container flex items-center h-full px-3 text-[15px] gap-1.5">
              <Gavel className="h-4 w-4 text-primary" /> First Appeal
            </span>
            {isSignedIn ? (
              <Link className="text-on-surface-variant hover:text-primary transition-colors flex items-center h-full hover:bg-surface-container-low px-3 font-medium text-[15px]" href="/history">
                My History
              </Link>
            ) : (
              <SignInButton mode="modal">
                <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center h-full hover:bg-surface-container-low px-3 font-medium text-[15px] cursor-pointer">
                  My History
                </button>
              </SignInButton>
            )}
          </nav>
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
            ) : (
              <SignInButton mode="modal">
                <button className="hidden md:block font-label-md text-sm text-on-surface-variant hover:text-primary px-3 py-1.5 transition-colors font-semibold cursor-pointer">
                  Login / Register
                </button>
              </SignInButton>
            )}
            {isSignedIn ? (
              <Link
                href="/track"
                className="bg-surface-container border border-outline-variant text-primary font-label-md text-sm px-4 py-2 rounded-lg font-bold hover:bg-surface-container-high transition-all cursor-pointer"
              >
                Track Status
              </Link>
            ) : (
              <SignInButton mode="modal">
                <button
                  className="bg-surface-container border border-outline-variant text-primary font-label-md text-sm px-4 py-2 rounded-lg font-bold hover:bg-surface-container-high transition-all cursor-pointer"
                >
                  Track Status
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10 flex flex-col gap-8">
        {/* ========================================== */}
        {/* STAGE 1: APPEAL DRAFTING & REVIEW          */}
        {/* ========================================== */}
        {stage === 1 && (
          <section className="flex flex-col gap-6">
            {/* Header Banner */}
            <div className="flex flex-col gap-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant text-primary text-xs font-bold w-fit">
                <Gavel className="h-3.5 w-3.5" />
                Statutory First Appeal under Section 19(1) of RTI Act, 2005
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
                Prepare First Appeal Petition
              </h1>
              <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
                If the CPIO failed to respond within 30 days or provided incomplete/evasive records, you can file a First Appeal with the designated First Appellate Authority (FAA).
              </p>
            </div>

            {submitError && (
              <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-center gap-3 text-sm font-semibold">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Zero Fee Statutory Banner */}
            <div className="flex items-start gap-3 p-4 bg-surface-container-low border border-outline-variant rounded-xl text-xs text-on-surface">
              <ShieldCheck className="h-5 w-5 text-[#15803d] shrink-0 mt-0.5" />
              <div>
                <strong className="text-primary block font-bold">Zero Filing Fee Notice:</strong>
                <span>Under the Central Right to Information Rules, 2012, no application fee is charged for filing a First Appeal.</span>
              </div>
            </div>

            {/* Card 1: Reference RTI & Public Authority */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <h2 className="text-base font-bold text-primary pb-2 border-b border-outline-variant">
                1. Original RTI &amp; Competent Authority
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-on-surface block mb-1" htmlFor="orig-rti">
                    Original RTI Registration Number
                  </label>
                  <input
                    id="orig-rti"
                    type="text"
                    value={originalRtiNumber}
                    onChange={(e) => setOriginalRtiNumber(e.target.value)}
                    placeholder="e.g., RTI/2026/7829142"
                    className="w-full bg-surface p-2.5 rounded-lg border text-xs font-mono font-bold text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1" htmlFor="auth-name">
                    Public Authority / Ministry
                  </label>
                  <input
                    id="auth-name"
                    type="text"
                    value={authorityName}
                    onChange={(e) => setAuthorityName(e.target.value)}
                    placeholder="e.g., Ministry of Road Transport and Highways"
                    className="w-full bg-surface p-2.5 rounded-lg border text-xs text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Grounds of Appeal */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <h2 className="text-base font-bold text-primary pb-2 border-b border-outline-variant">
                2. Grounds of First Appeal
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {APPEAL_GROUNDS.map((ground) => {
                  const isSelected = selectedGround === ground.id;
                  return (
                    <label
                      key={ground.id}
                      onClick={() => setSelectedGround(ground.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                        isSelected
                          ? "border-primary bg-surface-container-low ring-2 ring-primary ring-offset-1"
                          : "border-outline-variant hover:bg-surface-container-low/60"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <input
                          type="radio"
                          name="appeal_ground"
                          checked={isSelected}
                          onChange={() => setSelectedGround(ground.id)}
                          className="mt-0.5 text-primary"
                        />
                        <div>
                          <span className="font-bold text-xs text-primary block">
                            {ground.label}
                          </span>
                          <span className="text-[11px] text-on-surface-variant leading-relaxed mt-1 block">
                            {ground.description}
                          </span>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Card 3: Auto-Generated Appeal Petition */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant">
                <h2 className="text-base font-bold text-primary">
                  3. Statutory First Appeal Petition (Section 19(1))
                </h2>
                <span className="text-xs font-mono text-on-surface-variant">
                  {appealBody.length} / 3000 chars
                </span>
              </div>

              {isGeneratingDraft ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-center text-xs text-on-surface-variant">
                  <RotateCw className="h-6 w-6 animate-spin text-primary" />
                  <span>Synthesizing legal grounds and statutory prayers...</span>
                </div>
              ) : (
                <textarea
                  rows={14}
                  maxLength={3000}
                  value={appealBody}
                  onChange={(e) => setAppealBody(e.target.value)}
                  className="w-full bg-surface-container-low p-4 rounded-xl font-mono text-xs text-on-surface leading-relaxed border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                ></textarea>
              )}
            </div>

            {/* Card 4: Appellant Contact Profile */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <div className="flex justify-between items-center pb-2 border-b border-outline-variant">
                <h2 className="text-base font-bold text-primary">
                  4. Appellant Profile
                </h2>
                <span className="text-xs text-on-surface-variant">Official communication address</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                <div>
                  <label className="font-semibold text-on-surface block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={appellant.fullName}
                    onChange={(e) => setAppellant({ ...appellant, fullName: e.target.value })}
                    placeholder="e.g., Rajesh Kumar"
                    className="w-full bg-surface p-2.5 rounded-lg border text-xs text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={appellant.email}
                    onChange={(e) => setAppellant({ ...appellant, email: e.target.value })}
                    placeholder="e.g., rajesh.kumar@example.com"
                    className="w-full bg-surface p-2.5 rounded-lg border text-xs text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Mobile Number (+91)</label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={appellant.mobile}
                    onChange={(e) => setAppellant({ ...appellant, mobile: e.target.value.replace(/\D/g, "") })}
                    placeholder="e.g., 9876543210"
                    className="w-full bg-surface p-2.5 rounded-lg border text-xs text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-semibold text-on-surface block mb-1">Complete Postal Address</label>
                  <input
                    type="text"
                    value={appellant.address}
                    onChange={(e) => setAppellant({ ...appellant, address: e.target.value })}
                    placeholder="e.g., Flat 402, Block B, Central Enclave, New Delhi"
                    className="w-full bg-surface p-2.5 rounded-lg border text-xs text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-on-surface block mb-1">Pincode</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={appellant.pincode}
                    onChange={(e) => setAppellant({ ...appellant, pincode: e.target.value.replace(/\D/g, "") })}
                    placeholder="e.g., 110001"
                    className="w-full bg-surface p-2.5 rounded-lg border text-xs text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Declarations */}
              <div className="p-3.5 bg-surface-container-low border border-outline-variant rounded-xl flex items-start gap-3 mt-2">
                <input
                  type="checkbox"
                  checked={declarationConfirmed}
                  onChange={(e) => setDeclarationConfirmed(e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary rounded"
                />
                <span className="text-xs text-on-surface leading-relaxed">
                  I solemnly declare that the facts stated in this First Appeal petition are true to my knowledge, and no other appeal on this subject matter is pending before any court of law.
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
              <Link
                href="/response-analysis"
                className="px-6 py-3 border border-outline text-on-surface-variant font-semibold text-sm rounded-xl hover:bg-surface-container-low transition-colors flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Response Analysis
              </Link>

              <button
                type="button"
                onClick={handleSubmitAppeal}
                disabled={isSubmitting || !declarationConfirmed}
                className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary/90 text-on-primary font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <RotateCw className="h-4 w-4 animate-spin" /> Lodging First Appeal...
                  </>
                ) : (
                  <>
                    <Gavel className="h-4 w-4" /> Lodge First Appeal (₹0 Fee) <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </section>
        )}

        {/* ========================================== */}
        {/* STAGE 2: SUBMISSION CONFIRMATION & RECEIPT */}
        {/* ========================================== */}
        {stage === 2 && submissionResult && (
          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-lg p-8 md:p-12 flex flex-col items-center text-center gap-6 max-w-2xl mx-auto my-4">
            <div className="w-16 h-16 rounded-full bg-[#f0fdf4] text-[#15803d] border border-[#15803d]/30 flex items-center justify-center shadow-sm">
              <Check className="h-8 w-8 text-[#15803d]" strokeWidth={3} />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#15803d] bg-[#f0fdf4] px-3 py-1 rounded-full border border-[#15803d]/20">
                First Appeal Lodged Successfully
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mt-3">
                First Appeal Registered with FAA
              </h2>
              <p className="text-on-surface-variant text-sm mt-1">
                Your statutory appeal has been assigned to the First Appellate Authority bench.
              </p>
            </div>

            {/* Appeal Reference Card */}
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5 w-full flex flex-col gap-2">
              <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
                First Appeal Registration Number
              </span>
              <span className="text-2xl md:text-3xl font-bold font-mono text-primary tracking-tight">
                {submissionResult.appeal_id}
              </span>
              <span className="text-xs text-on-surface-variant">
                Public Authority: <strong>{submissionResult.authority_name}</strong> | Original RTI: <span className="font-mono">{submissionResult.original_rti_number}</span>
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full pt-2">
              <button
                type="button"
                onClick={handleDownloadAppeal}
                className="flex-1 bg-surface-container border border-outline-variant hover:bg-surface-container-high text-primary font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <Download className="h-4 w-4" /> Download Appeal Petition
              </button>

              <button
                type="button"
                onClick={() => router.push(`/track?id=${encodeURIComponent(submissionResult.appeal_id)}`)}
                className="flex-1 bg-primary text-on-primary hover:bg-primary/90 font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                Track Appeal Status <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed mt-2">
              Under Section 19(6) of the RTI Act, 2005, the First Appellate Authority is mandated to adjudicate and dispose of this appeal within 30 days (or 45 days with recorded reasons).
            </p>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-on-primary font-caption text-xs full-width bottom-0 mt-auto border-t border-primary-container">
        <div className="w-full py-5 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-4">
          <div className="font-label-md text-xs font-bold text-on-primary">
            © 2024 RTI Online. Government of India.
          </div>
          <div className="flex flex-wrap gap-5 justify-center">
            <a className="text-on-primary opacity-80 hover:opacity-100 hover:text-secondary-fixed cursor-pointer transition-opacity" href="#">
              Privacy Policy
            </a>
            <a className="text-on-primary opacity-80 hover:opacity-100 hover:text-secondary-fixed cursor-pointer transition-opacity" href="#">
              Terms of Service
            </a>
            <Link className="text-on-primary opacity-80 hover:opacity-100 hover:text-secondary-fixed cursor-pointer transition-opacity font-semibold" href="/faq">
              Help Desk
            </Link>
            <a className="text-on-primary opacity-80 hover:opacity-100 hover:text-secondary-fixed cursor-pointer transition-opacity" href="#">
              Accessibility Statement
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function FirstAppealPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-sm font-semibold">Loading First Appeal...</div>}>
      <FirstAppealContent />
    </Suspense>
  );
}
