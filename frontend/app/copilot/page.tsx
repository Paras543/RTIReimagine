"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";
import {
  Landmark,
  Bot,
  Sparkles,
  Search,
  UploadCloud,
  FileText,
  AlertTriangle,
  Info,
  Edit,
  ArrowRight,
  ArrowLeft,
  Download,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Paperclip,
  Printer,
  RotateCw,
  Zap,
  Check,
} from "lucide-react";

// State and District Data for India
const STATE_DISTRICT_MAP: Record<string, string[]> = {
  DL: ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
  MH: ["Mumbai City", "Mumbai Suburban", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Amravati"],
  UP: ["Lucknow", "Kanpur Nagar", "Varanasi", "Prayagraj", "Agra", "Gautam Buddha Nagar (Noida)", "Ghaziabad", "Meerut", "Bareilly", "Aligarh"],
  KA: ["Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Dakshina Kannada (Mangaluru)", "Belagavi", "Hubballi-Dharwad", "Kalaburagi", "Udupi", "Tumakuru"],
  TN: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Kanchipuram"],
  WB: ["Kolkata", "North 24 Parganas", "South 24 Parganas", "Howrah", "Hooghly", "Darjeeling", "Paschim Bardhaman"],
  GJ: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar"],
  RJ: ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar"],
  KL: ["Thiruvananthapuram", "Ernakulam (Kochi)", "Kozhikode", "Thrissur", "Kollam", "Kannur", "Palakkad"],
  TG: ["Hyderabad", "Ranga Reddy", "Medchal-Malkajgiri", "Warangal", "Nizamabad", "Karimnagar"],
};

// Sample realistic queries for 1-click citizen guidance
const SAMPLE_QUERIES = [
  {
    title: "NH-48 Highway Expansion Delay",
    query: "Delay in construction of National Highway 48 expansion near Jaipur bypass. Seeking copy of original timeline, physical progress, reasons for delay, and details of penalties levied on the contractor.",
  },
  {
    title: "PDS Ration Quota & Shop Allocation",
    query: "Irregular food grain distribution at Fair Price Shop. Seeking monthly allocation records of wheat and rice, stock register for past 6 months, and active list of registered AAY/PHH cardholders.",
  },
  {
    title: "Hospital Tender & Medicine Stocks",
    query: "Seeking sanctioned vs actual working strength of medical officers at Central District Hospital, procurement details of essential life-saving medicines, and operational log of the ICU oxygen plant.",
  },
  {
    title: "University Scholarship Fund Disbursement",
    query: "Delay in disbursement of Post-Matric Merit Scholarship grant for current academic year. Seeking total funds received, number of beneficiaries approved, and reasons for pending disbursals.",
  },
];


export default function CopilotPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();


  // Copilot Flow Stage: 1: Prompt & RAG, 2: Auto-filled Review, 3: Dummy Payment, 4: Success Confirmation
  const [copilotStage, setCopilotStage] = useState<1 | 2 | 3 | 4>(1);

  // Prompt & RAG Input State
  const [userQuery, setUserQuery] = useState("");
  const [uploadedDoc, setUploadedDoc] = useState<{
    fileName: string;
    fileContent: string;
  } | null>(null);

  // AI Generation Loading & Results
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [aiDraftResult, setAiDraftResult] = useState<{
    inferred_category: string;
    recommended_ministry: string;
    recommended_department: string;
    jurisdiction_reason: string;
    subject: string;
    structured_rti_text: string;
    char_count: number;
    extracted_rag_facts: string[];
    key_questions: string[];
  } | null>(null);

  // Form Fields (Auto-filled by AI & easily customizable)
  const [applicant, setApplicant] = useState({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    state: "DL",
    district: "New Delhi",
    pincode: "",
  });


  const [category, setCategory] = useState({
    isBpl: false,
    bplNumber: "",
    selectedCategoryName: "Infrastructure & Transport",
  });

  const [authority, setAuthority] = useState({
    ministry: "Ministry of Road Transport and Highways",
    department: "National Highways Authority of India (NHAI)",
  });

  const [requestDetails, setRequestDetails] = useState({
    subject: "",
    requestText: "",
  });

  const [declarations, setDeclarations] = useState({
    confirmTrue: true,
    confirmReviewed: true,
  });

  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking" | "rupay">("upi");

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<{
    application_id: string;
    authority_name: string;
    department: string;
    submitted_date: string;
    receipt_id: string;
    fee_amount: number;
  } | null>(null);

  // Handle RAG Document Upload & Local Text Extraction
  const handleDocUpload = (file: File | null) => {
    if (!file) return;
    const fileName = file.name;

    // Read plain text if text file, or use file metadata
    if (file.type.includes("text") || fileName.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setUploadedDoc({ fileName, fileContent: text });
      };
      reader.readAsText(file);
    } else {
      // Simulate RAG text extraction from PDF / Image metadata
      const simulatedText = `[File: ${fileName}, Size: ${(file.size / 1024).toFixed(1)} KB] Tender Reference NIT-2025/NH-48/W-912, Sanctioned Amount: Rs. 48.5 Crore, Approved timeline date: 15 March 2024. Notice issued by Chief Project Engineer.`;
      setUploadedDoc({ fileName, fileContent: simulatedText });
    }
  };

  // Generate AI Draft via Copilot Backend API
  const handleGenerateAiDraft = async () => {
    if (!userQuery.trim()) {
      setGenerationError("Please enter your query or choose one of the sample topics below.");
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const res = await fetch("/api/proxy/copilot/auto-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query_text: userQuery,
          document_name: uploadedDoc?.fileName || null,
          document_content: uploadedDoc?.fileContent || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to generate AI RTI draft.");
      }

      const data = await res.json();
      setAiDraftResult(data);

      // Auto-populate all form fields
      setAuthority({
        ministry: data.recommended_ministry,
        department: data.recommended_department,
      });
      setCategory((prev) => ({
        ...prev,
        selectedCategoryName: data.inferred_category,
      }));
      setRequestDetails({
        subject: data.subject,
        requestText: data.structured_rti_text,
      });

      // Advance to Auto-Filled Review Stage
      setCopilotStage(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setGenerationError(err.message || "Could not connect to AI Copilot service.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Submit Final Application
  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      applicant: {
        full_name: applicant.fullName || "Rajesh Kumar",
        email: applicant.email || "rajesh.kumar@gov.in",
        mobile: applicant.mobile || "9876543210",
        address: applicant.address || "Flat 402, Block B, Central Enclave",
        state: applicant.state || "DL",
        district: applicant.district || "New Delhi",
        pincode: applicant.pincode || "110001",
      },
      category: {
        is_bpl: category.isBpl,
        bpl_card_number: category.bplNumber || null,
        bpl_certificate_url: null,
        category_name: category.selectedCategoryName,
      },
      authority: {
        ministry: authority.ministry,
        department: authority.department,
      },
      subject: requestDetails.subject,
      request_text: requestDetails.requestText,
      attached_documents: uploadedDoc ? [uploadedDoc.fileName] : [],
    };

    try {
      const res = await fetch("/api/proxy/manual-filing/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Failed to submit RTI application.");
      }

      const result = await res.json();
      setSubmissionResult(result);
      setCopilotStage(4); // Advance to Success Screen
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setSubmitError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Download Receipt Handler
  const handleDownloadReceipt = () => {
    if (!submissionResult) return;
    const content = `=====================================================
RTI ONLINE - OFFICIAL APPLICATION RECEIPT (AI COPILOT)
Government of India | Department of Personnel & Training
=====================================================
Registration Number : ${submissionResult.application_id}
Receipt Reference   : ${submissionResult.receipt_id}
Public Authority    : ${submissionResult.authority_name}
Department          : ${submissionResult.department}
Submission Date     : ${submissionResult.submitted_date}
Applicant Name      : ${applicant.fullName}
Contact Mobile      : +91 ${applicant.mobile}
Fee Paid            : ₹${submissionResult.fee_amount.toFixed(2)} (${category.isBpl ? "BPL Exemption" : "Standard"})

RTI Application Content:
${requestDetails.requestText}

Statutory Notice:
Under Section 7(1) of the Right to Information Act, 2005,
the CPIO is mandated to provide information within 30 days.
=====================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `RTI_Receipt_${submissionResult.application_id.replace(/[/\\?%*:|"<>]/g, "_")}.txt`;
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
            <span className="text-primary font-bold border-b-2 border-secondary-container flex items-center h-full px-3 text-[15px] gap-1.5">
              <Bot className="h-4 w-4 text-primary" /> RTI Copilot
            </span>
            <Link className="text-on-surface-variant hover:text-primary transition-colors flex items-center h-full hover:bg-surface-container-low px-3 font-medium text-[15px]" href="/track">
              Track Status
            </Link>
            <Link className="text-on-surface-variant hover:text-primary transition-colors flex items-center h-full hover:bg-surface-container-low px-3 font-medium text-[15px]" href="/history">
              My History
            </Link>
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
            <Link
              href="/track"
              className="bg-surface-container border border-outline-variant text-primary font-label-md text-sm px-4 py-2 rounded-lg font-bold hover:bg-surface-container-high transition-all cursor-pointer"
            >
              Track Status
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10 flex flex-col gap-8">
        {/* ==================================================== */}
        {/* STAGE 1: PROMPT INPUT & RAG DOCUMENT UPLOAD LAYER   */}
        {/* ==================================================== */}
        {copilotStage === 1 && (
          <section className="flex flex-col gap-6">
            {/* Header Banner */}
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
                What information would you like to seek?
              </h1>
              <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
                Describe your issue in plain words or upload a supporting notice/tender. Our AI Copilot will identify the competent Central Public Authority and auto-generate your structured RTI application.
              </p>
            </div>

            {/* Error Message */}
            {generationError && (
              <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-center gap-3 text-sm font-semibold">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <span>{generationError}</span>
              </div>
            )}

            {/* Prompt Card */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-sm font-bold text-on-surface flex items-center justify-between" htmlFor="copilot-prompt">
                  <span>Describe your query / problem</span>
                  <span className="text-xs text-on-surface-variant font-normal">Plain English or Hindi</span>
                </label>
                <textarea
                  id="copilot-prompt"
                  rows={5}
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="e.g., Delay in construction of road expansion near Jaipur bypass, contractor penalties, and original project timeline..."
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-4 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs resize-y leading-relaxed"
                ></textarea>
              </div>

              {/* Sample Queries Pill Grid */}
              <div className="flex flex-col gap-2.5">
                <span className="font-caption text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                  Or click a sample topic to test:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SAMPLE_QUERIES.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setUserQuery(sample.query)}
                      className="text-left p-3 rounded-xl border border-outline-variant/80 hover:border-primary bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer group"
                    >
                      <div className="font-semibold text-xs text-primary group-hover:underline">
                        {sample.title}
                      </div>
                      <div className="font-caption text-[11px] text-on-surface-variant line-clamp-2 mt-0.5">
                        {sample.query}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Document Upload */}
              <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/60">
                <div className="flex items-center justify-between">
                  <label className="font-label-md text-xs font-bold text-on-surface flex items-center gap-1.5">
                    <Paperclip className="h-3.5 w-3.5 text-primary" />
                    Upload Supporting Document (Optional)
                  </label>
                </div>


                {uploadedDoc ? (
                  <div className="flex items-center justify-between p-3 bg-surface-container-low border border-primary/40 rounded-xl">
                    <div className="flex items-center gap-2.5 text-xs text-primary font-semibold truncate">
                      <FileText className="h-4 w-4 text-primary shrink-0" />
                      <span className="truncate">{uploadedDoc.fileName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadedDoc(null)}
                      className="text-error hover:underline text-xs flex items-center gap-1 cursor-pointer shrink-0 ml-2"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-outline-variant hover:border-primary rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 bg-surface-container-low/50 hover:bg-surface-container-low transition-all cursor-pointer group text-center">
                    <UploadCloud className="h-7 w-7 text-outline group-hover:text-primary transition-colors" />
                    <div className="text-xs text-on-surface">
                      <span className="font-bold text-primary group-hover:underline">Upload file</span> or drag and drop
                    </div>
                    <p className="text-[11px] text-on-surface-variant">
                      Official notices, tenders, bills, or grievance letters (PDF, JPG, TXT up to 5MB)
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.txt"
                      className="hidden"
                      onChange={(e) => handleDocUpload(e.target.files?.[0] || null)}
                    />
                  </label>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleGenerateAiDraft}
                  disabled={isGenerating || !userQuery.trim()}
                  className="w-full bg-primary hover:bg-primary/90 text-on-primary font-bold text-base py-4 px-6 rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <RotateCw className="h-5 w-5 animate-spin" />
                      Analyzing Intent &amp; Auto-Drafting with Copilot...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 text-secondary-container" />
                      Auto-Draft RTI Application with Copilot
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================== */}
        {/* STAGE 2: AUTO-FILLED REVIEW & CUSTOMIZATION         */}
        {/* ==================================================== */}
        {copilotStage === 2 && aiDraftResult && (
          <section className="flex flex-col gap-6">
            {/* AI Intelligence Badge */}
            <div className="bg-surface-container-lowest border border-primary/30 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-primary">
                      AI Copilot Analysis Complete
                    </h2>
                    <span className="text-xs text-on-surface-variant">
                      Target Public Authority &amp; Legal Draft synthesized automatically.
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold">
                  {aiDraftResult.inferred_category}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-on-surface block">Identified Public Authority:</span>
                  <span className="text-primary font-bold text-sm block mt-0.5">{authority.ministry}</span>
                  <span className="text-on-surface-variant block">{authority.department}</span>
                </div>
                <div>
                  <span className="font-bold text-on-surface block">Jurisdiction Rationale:</span>
                  <span className="text-on-surface-variant leading-relaxed block mt-0.5">
                    {aiDraftResult.jurisdiction_reason}
                  </span>
                </div>
              </div>

              {/* RAG Extracted Facts if any */}
              {aiDraftResult.extracted_rag_facts.length > 0 && (
                <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/60 flex flex-col gap-1 text-xs">
                  <span className="font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Facts Extracted from Uploaded Document:
                  </span>
                  <div className="flex flex-wrap gap-2 mt-0.5">
                    {aiDraftResult.extracted_rag_facts.map((fact, i) => (
                      <span key={i} className="bg-surface-container-lowest px-2.5 py-1 rounded-md border text-on-surface font-mono text-[11px]">
                        {fact}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bento Review Cards */}
            <div className="flex flex-col gap-5">
              {/* Applicant Details */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-2xs flex flex-col gap-3.5">
                <div className="flex justify-between items-center pb-2.5 border-b border-outline-variant">
                  <h3 className="font-bold text-sm text-primary">Applicant Profile</h3>
                  <span className="text-xs text-on-surface-variant">Enter your contact details for statutory records</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={applicant.fullName}
                      onChange={(e) => setApplicant({ ...applicant, fullName: e.target.value })}
                      placeholder="e.g., Rajesh Kumar"
                      className="w-full bg-surface p-2.5 rounded-lg border text-xs text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={applicant.email}
                      onChange={(e) => setApplicant({ ...applicant, email: e.target.value })}
                      placeholder="e.g., rajesh.kumar@example.com"
                      className="w-full bg-surface p-2.5 rounded-lg border text-xs text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      maxLength={10}
                      value={applicant.mobile}
                      onChange={(e) => setApplicant({ ...applicant, mobile: e.target.value.replace(/\D/g, "") })}
                      placeholder="e.g., 9876543210"
                      className="w-full bg-surface p-2.5 rounded-lg border text-xs text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-semibold text-on-surface block mb-1">Complete Address</label>
                    <input
                      type="text"
                      value={applicant.address}
                      onChange={(e) => setApplicant({ ...applicant, address: e.target.value })}
                      placeholder="e.g., Flat 402, Block B, Central Enclave"
                      className="w-full bg-surface p-2.5 rounded-lg border text-xs text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-on-surface block mb-1">Pincode</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={applicant.pincode}
                      onChange={(e) => setApplicant({ ...applicant, pincode: e.target.value.replace(/\D/g, "") })}
                      placeholder="e.g., 110001"
                      className="w-full bg-surface p-2.5 rounded-lg border text-xs text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>


              {/* RTI Application Body (Auto-generated & fully editable) */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 md:p-6 shadow-2xs flex flex-col gap-3">
                <div className="flex justify-between items-center border-b border-outline-variant pb-2.5">
                  <h3 className="font-bold text-sm text-primary">Auto-Generated RTI Application</h3>
                  <span className="text-xs font-mono text-on-surface-variant">
                    {requestDetails.requestText.length} / 3000 chars
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-xs text-on-surface" htmlFor="draft-subject">Subject</label>
                  <input
                    id="draft-subject"
                    type="text"
                    value={requestDetails.subject}
                    onChange={(e) => setRequestDetails({ ...requestDetails, subject: e.target.value })}
                    className="w-full bg-surface p-2.5 rounded-lg border text-xs font-bold text-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-semibold text-xs text-on-surface" htmlFor="draft-body">Application Content (Section 6/7 Compliant)</label>
                  <textarea
                    id="draft-body"
                    rows={12}
                    maxLength={3000}
                    value={requestDetails.requestText}
                    onChange={(e) => setRequestDetails({ ...requestDetails, requestText: e.target.value })}
                    className="w-full bg-surface-container-low p-4 rounded-xl border border-outline-variant font-mono text-xs text-on-surface leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-primary"
                  ></textarea>
                </div>
              </div>

              {/* Declarations */}
              <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-xl flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={declarations.confirmTrue}
                  onChange={(e) => setDeclarations({ ...declarations, confirmTrue: e.target.checked })}
                  className="mt-1 w-4 h-4 text-primary rounded"
                />
                <span className="text-xs text-on-surface leading-relaxed">
                  I confirm that the AI-assisted drafted application accurately represents my RTI request under Section 6(1) of the Right to Information Act, 2005.
                </span>
              </div>

              {/* Navigation Actions */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setCopilotStage(1)}
                  className="px-6 py-3 border border-outline text-on-surface-variant font-semibold text-sm rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Edit AI Query
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCopilotStage(3);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={!declarations.confirmTrue}
                  className="px-8 py-3.5 bg-primary hover:bg-primary/90 text-on-primary font-bold text-sm rounded-xl transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
                >
                  Proceed to Payment <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================== */}
        {/* STAGE 3: APPLICATION FEE & PAYMENT (DUMMY GATEWAY)  */}
        {/* ==================================================== */}
        {copilotStage === 3 && (
          <section className="flex flex-col gap-6 w-full">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary">
                Application Fee
              </h2>
              <p className="text-on-surface-variant text-sm md:text-base mt-1">
                Please select a payment method to complete your RTI application.
              </p>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Payment Methods Column */}
              <div className="md:col-span-2 flex flex-col gap-5">
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-2xs flex flex-col gap-4">
                  <h3 className="font-headline-md text-base font-bold text-primary">
                    Payment Options
                  </h3>

                  <div className="flex flex-col gap-3">
                    {/* UPI */}
                    <label
                      onClick={() => setPaymentMethod("upi")}
                      className={`flex items-center p-3.5 border rounded-xl cursor-pointer transition-all gap-3.5 ${
                        paymentMethod === "upi"
                          ? "border-primary bg-primary-fixed-dim/15 ring-2 ring-primary ring-offset-1"
                          : "border-outline-variant hover:bg-surface-container-low"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        checked={paymentMethod === "upi"}
                        onChange={() => setPaymentMethod("upi")}
                        className="w-4 h-4 text-primary"
                      />
                      <div className="flex flex-col flex-grow">
                        <span className="font-label-md text-sm font-semibold text-on-surface">
                          UPI (Unified Payments Interface)
                        </span>
                        <span className="font-caption text-xs text-on-surface-variant">
                          Google Pay, PhonePe, Paytm, BHIM, Any UPI App
                        </span>
                      </div>
                    </label>

                    {/* Debit/Credit Card */}
                    <label
                      onClick={() => setPaymentMethod("card")}
                      className={`flex items-center p-3.5 border rounded-xl cursor-pointer transition-all gap-3.5 ${
                        paymentMethod === "card"
                          ? "border-primary bg-primary-fixed-dim/15 ring-2 ring-primary ring-offset-1"
                          : "border-outline-variant hover:bg-surface-container-low"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="w-4 h-4 text-primary"
                      />
                      <div className="flex flex-col flex-grow">
                        <span className="font-label-md text-sm font-semibold text-on-surface">
                          Debit / Credit Card
                        </span>
                        <span className="font-caption text-xs text-on-surface-variant">
                          Visa, Mastercard, Maestro, RuPay
                        </span>
                      </div>
                    </label>

                    {/* Net Banking */}
                    <label
                      onClick={() => setPaymentMethod("netbanking")}
                      className={`flex items-center p-3.5 border rounded-xl cursor-pointer transition-all gap-3.5 ${
                        paymentMethod === "netbanking"
                          ? "border-primary bg-primary-fixed-dim/15 ring-2 ring-primary ring-offset-1"
                          : "border-outline-variant hover:bg-surface-container-low"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        checked={paymentMethod === "netbanking"}
                        onChange={() => setPaymentMethod("netbanking")}
                        className="w-4 h-4 text-primary"
                      />
                      <div className="flex flex-col flex-grow">
                        <span className="font-label-md text-sm font-semibold text-on-surface">
                          Net Banking
                        </span>
                        <span className="font-caption text-xs text-on-surface-variant">
                          All major Indian public and private sector banks
                        </span>
                      </div>
                    </label>

                    {/* RuPay Card */}
                    <label
                      onClick={() => setPaymentMethod("rupay")}
                      className={`flex items-center p-3.5 border rounded-xl cursor-pointer transition-all gap-3.5 ${
                        paymentMethod === "rupay"
                          ? "border-primary bg-primary-fixed-dim/15 ring-2 ring-primary ring-offset-1"
                          : "border-outline-variant hover:bg-surface-container-low"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        checked={paymentMethod === "rupay"}
                        onChange={() => setPaymentMethod("rupay")}
                        className="w-4 h-4 text-primary"
                      />
                      <div className="flex flex-col flex-grow">
                        <span className="font-label-md text-sm font-semibold text-on-surface">
                          RuPay Debit Card
                        </span>
                        <span className="font-caption text-xs text-on-surface-variant">
                          Zero transaction processing fee
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Security Disclaimer Notice */}
                <div className="flex items-start gap-3 p-3.5 bg-surface-container border-l-4 border-secondary rounded-r-lg">
                  <ShieldCheck className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <p className="font-caption text-xs text-on-surface-variant leading-relaxed">
                    You will be securely routed through the Non-Tax Receipt Portal (NTRP) / Bharatkosh SBI ePay Payment Gateway.
                  </p>
                </div>
              </div>

              {/* Summary Column */}
              <div className="md:col-span-1 flex flex-col gap-4">
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-2xs flex flex-col gap-4 sticky top-20">
                  <h3 className="font-label-md text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Payment Summary
                  </h3>

                  <div className="flex flex-col gap-2.5 border-b border-outline-variant pb-3 text-sm">
                    <div className="flex justify-between items-center text-on-surface">
                      <span>RTI Application Fee</span>
                      <span className="font-semibold">₹10.00</span>
                    </div>
                    <div className="flex justify-between items-center text-on-surface-variant text-xs">
                      <span>Processing Convenience Fee</span>
                      <span>₹0.00</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="font-headline-md text-lg font-bold text-primary">Total Payable</span>
                    <span className="font-headline-md text-xl font-extrabold text-primary">₹10.00</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmitApplication}
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-on-primary font-bold text-sm py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <RotateCw className="h-4 w-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        Pay ₹10 <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-on-surface-variant text-xs font-medium">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>100% Encrypted &amp; Secure Payment</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCopilotStage(2)}
                  className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Review
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================== */}
        {/* STAGE 4: SUBMISSION CONFIRMATION & OFFICIAL RECEIPT  */}
        {/* ==================================================== */}
        {copilotStage === 4 && submissionResult && (
          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-lg p-8 md:p-12 flex flex-col items-center text-center gap-6 max-w-2xl mx-auto my-4">
            <div className="w-16 h-16 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shadow-sm">
              <Check className="h-8 w-8 text-on-tertiary-container" strokeWidth={3} />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-secondary-container bg-surface-container-low px-3 py-1 rounded-full">
                Application Filed Successfully
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mt-3">
                RTI Application Submitted via Copilot
              </h2>
              <p className="text-on-surface-variant text-sm mt-1">
                Your request has been officially recorded with the Central Secretariat.
              </p>
            </div>

            {/* Registration Number Highlight Card */}
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-5 w-full flex flex-col gap-2">
              <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
                RTI Registration Number
              </span>
              <span className="text-2xl md:text-3xl font-bold font-mono text-primary tracking-tight">
                {submissionResult.application_id}
              </span>
              <span className="text-xs text-on-surface-variant">
                Public Authority: <strong>{submissionResult.authority_name}</strong> ({submissionResult.department})
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full pt-2">
              <button
                type="button"
                onClick={handleDownloadReceipt}
                className="flex-1 bg-surface-container border border-outline-variant hover:bg-surface-container-high text-primary font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <Download className="h-4 w-4" /> Download Official Receipt
              </button>

              <button
                type="button"
                onClick={() => router.push(`/track?id=${encodeURIComponent(submissionResult.application_id)}`)}
                className="flex-1 bg-primary text-on-primary hover:bg-primary/90 font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                Track Live Status <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed mt-2">
              A statutory acknowledgment copy has been prepared. Under Section 7(1) of the RTI Act, 2005, the CPIO is mandated to provide information within 30 days of submission.
            </p>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-on-primary font-caption text-xs full-width bottom-0 mt-auto border-t border-primary-container">
        <div className="w-full py-5 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-4">
          <div className="font-label-md text-xs font-bold text-on-primary">
            © 2024 RTI Online. Designed and Developed by National Informatics Centre (NIC).
          </div>
          <div className="flex flex-wrap gap-5 justify-center">
            <a className="text-on-primary opacity-80 hover:opacity-100 hover:text-secondary-fixed cursor-pointer transition-opacity" href="#">
              Privacy Policy
            </a>
            <a className="text-on-primary opacity-80 hover:opacity-100 hover:text-secondary-fixed cursor-pointer transition-opacity" href="#">
              Terms of Service
            </a>
            <a className="text-on-primary opacity-80 hover:opacity-100 hover:text-secondary-fixed cursor-pointer transition-opacity" href="#">
              Contact Us
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
