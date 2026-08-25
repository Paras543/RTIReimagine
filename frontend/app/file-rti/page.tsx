"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";
import {
  Landmark,
  Check,
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

// Ministries and Departments
const MINISTRIES_DATA: { ministry: string; departments: string[] }[] = [
  {
    ministry: "Ministry of Finance",
    departments: [
      "Department of Economic Affairs",
      "Department of Expenditure",
      "Department of Revenue",
      "Department of Financial Services",
      "Department of Public Enterprises",
      "Department of Investment and Public Asset Management (DIPAM)",
    ],
  },
  {
    ministry: "Ministry of Home Affairs",
    departments: [
      "Internal Security Division",
      "Police Division - I & II",
      "Union Territories Division",
      "Disaster Management Division",
      "Foreigners Division",
      "Central Armed Police Forces (CAPF)",
    ],
  },
  {
    ministry: "Ministry of Road Transport and Highways",
    departments: [
      "National Highways Authority of India (NHAI)",
      "Highways & Infrastructure Division",
      "Transport & Road Safety Division",
      "National Highways and Infrastructure Development Corporation (NHIDCL)",
    ],
  },
  {
    ministry: "Ministry of Education",
    departments: [
      "Department of Higher Education",
      "Department of School Education & Literacy",
      "University Grants Commission (UGC)",
      "Central Board of Secondary Education (CBSE)",
      "National Testing Agency (NTA)",
    ],
  },
  {
    ministry: "Ministry of Health and Family Welfare",
    departments: [
      "Department of Health and Family Welfare",
      "Department of Health Research (ICMR)",
      "National Health Authority (NHA)",
      "Food Safety and Standards Authority of India (FSSAI)",
    ],
  },
  {
    ministry: "Ministry of Railways",
    departments: [
      "Railway Board",
      "Northern Railway",
      "Western Railway",
      "Southern Railway",
      "Eastern Railway",
      "Indian Railway Catering and Tourism Corporation (IRCTC)",
    ],
  },
  {
    ministry: "Ministry of Personnel, Public Grievances and Pensions",
    departments: [
      "Department of Personnel and Training (DoPT)",
      "Department of Administrative Reforms and Public Grievances (DARPG)",
      "Department of Pension and Pensioners' Welfare",
      "Staff Selection Commission (SSC)",
      "Central Vigilance Commission (CVC)",
    ],
  },
];

export default function FileRtiPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  // Current Step: 1 to 6, and 7 is Success Confirmation
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
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
    bplFileName: "",
    selectedCategoryName: "Infrastructure & Transport",
  });

  const [authority, setAuthority] = useState({
    ministry: "Ministry of Road Transport and Highways",
    department: "National Highways Authority of India (NHAI)",
    searchQuery: "",
  });

  const [requestDetails, setRequestDetails] = useState({
    subject: "Details regarding construction & progress of public road works.",
    requestText:
      "Subject: Details regarding the delay in construction of National Highway 48 expansion near Jaipur bypass.\n\nTo the Central Public Information Officer,\n\n1. Please provide a copy of the original project completion timeline as approved by the NHAI for the NH-48 expansion project (Jaipur bypass section).\n2. What is the current official status of the project and the revised estimated date of completion?\n3. Please provide a certified copy of the reasons recorded for the delay, if any official notice or explanation has been filed by the primary contractor.\n4. Details of any penalties levied on the contractor for missing the initial deadlines.\n\nThank you.",
  });

  const [documents, setDocuments] = useState<{
    primaryDocName: string;
    idProofName: string;
    bplDocName: string;
  }>({
    primaryDocName: "",
    idProofName: "",
    bplDocName: "",
  });

  const [declarations, setDeclarations] = useState({
    confirmTrue: false,
    confirmReviewed: false,
  });

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

  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking" | "rupay">("upi");

  // Preserve state to localStorage on changes
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("rti_manual_filing_draft");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.applicant) setApplicant(parsed.applicant);
        if (parsed.category) setCategory(parsed.category);
        if (parsed.authority) setAuthority(parsed.authority);
        if (parsed.requestDetails) setRequestDetails(parsed.requestDetails);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "rti_manual_filing_draft",
        JSON.stringify({ applicant, category, authority, requestDetails })
      );
    } catch {
      // ignore
    }
  }, [applicant, category, authority, requestDetails]);

  const changeStep = (stepNum: number) => {
    setCurrentStep(stepNum);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step Validation Helpers
  const canProceedStep1 =
    applicant.fullName.trim() !== "" &&
    applicant.email.trim() !== "" &&
    applicant.mobile.trim().length >= 10 &&
    applicant.address.trim() !== "" &&
    applicant.pincode.trim().length >= 6;

  const canProceedStep2 = !category.isBpl || category.bplNumber.trim() !== "";
  const canProceedStep3 = authority.ministry !== "" && authority.department !== "";
  const canProceedStep4 = requestDetails.requestText.trim().length >= 10;
  const canProceedStep6 = declarations.confirmTrue && declarations.confirmReviewed;

  // Handle State Dropdown Change
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    const districts = STATE_DISTRICT_MAP[newState] || [];
    setApplicant({
      ...applicant,
      state: newState,
      district: districts[0] || "",
    });
  };

  // Handle File Upload Simulation
  const handleFileUpload = (type: "primary" | "idProof" | "bpl", file: File | null) => {
    if (!file) return;
    if (type === "primary") {
      setDocuments((prev) => ({ ...prev, primaryDocName: file.name }));
    } else if (type === "idProof") {
      setDocuments((prev) => ({ ...prev, idProofName: file.name }));
    } else if (type === "bpl") {
      setDocuments((prev) => ({ ...prev, bplDocName: file.name }));
      setCategory((prev) => ({ ...prev, bplFileName: file.name }));
    }
  };

  // Final Submit Handler
  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      applicant: {
        full_name: applicant.fullName || "Rajesh Kumar Sharma",
        email: applicant.email || "citizen.rti@nic.in",
        mobile: applicant.mobile || "9876543210",
        address: applicant.address || "12, Central Secretariat Lane, New Delhi",
        state: applicant.state || "DL",
        district: applicant.district || "New Delhi",
        pincode: applicant.pincode || "110001",
      },
      category: {
        is_bpl: category.isBpl,
        bpl_card_number: category.bplNumber || null,
        bpl_certificate_url: documents.bplDocName || null,
        category_name: category.selectedCategoryName,
      },
      authority: {
        ministry: authority.ministry,
        department: authority.department,
      },
      subject: requestDetails.subject,
      request_text: requestDetails.requestText,
      attached_documents: [
        documents.primaryDocName,
        documents.idProofName,
        documents.bplDocName,
      ].filter(Boolean),
    };

    try {
      const res = await fetch("/api/proxy/manual-filing/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to submit RTI application.");
      }

      const result = await res.json();
      setSubmissionResult(result);
      // Clear draft on successful submission
      localStorage.removeItem("rti_manual_filing_draft");
      changeStep(8); // Jump to Confirmation / Success
    } catch (err: any) {
      setSubmitError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Download Official Receipt
  const handleDownloadReceipt = () => {
    if (!submissionResult) return;
    const content = `=====================================================
RTI ONLINE - OFFICIAL APPLICATION RECEIPT
Government of India | Department of Personnel & Training
=====================================================
Registration Number : ${submissionResult.application_id}
Receipt Reference   : ${submissionResult.receipt_id}
Public Authority    : ${submissionResult.authority_name}
Department          : ${submissionResult.department}
Submission Date     : ${submissionResult.submitted_date}
Applicant Name      : ${applicant.fullName || "Rajesh Kumar Sharma"}
Contact Mobile      : +91 ${applicant.mobile || "9876543210"}
Fee Paid            : ₹${submissionResult.fee_amount.toFixed(2)} (${category.isBpl ? "BPL Exemption" : "Standard"})

RTI Questions / Subject:
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

  const stepsList = [
    { num: 1, label: "Applicant" },
    { num: 2, label: "Category" },
    { num: 3, label: "Authority" },
    { num: 4, label: "Request" },
    { num: 5, label: "Documents" },
    { num: 6, label: "Review" },
    { num: 7, label: "Payment" },
  ];


  // Percentage for the animated horizontal progress bar
  const progressPercent = ((currentStep - 1) / (stepsList.length - 1)) * 100;

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
            <span className="text-primary font-bold border-b-2 border-secondary-container flex items-center h-full px-3 text-[15px]">
              File RTI
            </span>
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
            <Link className="text-on-surface-variant hover:text-primary transition-colors flex items-center h-full hover:bg-surface-container-low px-3 font-medium text-[15px]" href="/faq">
              FAQ
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
        {/* Stepper Progress Indicator (Visible in steps 1 to 7) */}
        {currentStep <= 7 && (
          <section className="flex flex-col gap-6 w-full">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
                File a New RTI Request
              </h1>
              <p className="text-on-surface-variant text-sm md:text-base mt-1">
                Follow the standard statutory procedure under the Right to Information Act, 2005.
              </p>
            </div>


            {/* Stepper Line & Interactive Nodes */}
            <div className="w-full py-4 overflow-x-auto pb-2">
              <div className="relative flex items-center min-w-[620px] w-full px-6 justify-between">
                {/* Background Connecting Track Line */}
                <div className="absolute top-[18px] left-[42px] right-[42px] h-[3px] bg-[#cbd5e1] rounded-full z-0 overflow-hidden">
                  {/* Dynamic Filling Animation Line */}
                  <div
                    className="h-full bg-[#001f3f] transition-all duration-500 ease-in-out rounded-full"
                    style={{
                      width: `${((currentStep - 1) / (stepsList.length - 1)) * 100}%`,
                    }}
                  />
                </div>


                {stepsList.map((step) => {
                  const isCompleted = step.num < currentStep;
                  const isCurrent = step.num === currentStep;

                  return (
                    <button
                      key={step.num}
                      type="button"
                      onClick={() => changeStep(step.num)}
                      className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                          isCompleted
                            ? "bg-[#001f3f] text-white shadow-sm hover:scale-105"
                            : isCurrent
                            ? "bg-[#001f3f] text-white ring-4 ring-[#d3e3ff] scale-110 shadow-md"
                            : "bg-white text-[#475569] border-2 border-[#cbd5e1] hover:border-[#94a3b8]"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-4 w-4 text-white" strokeWidth={3} />
                        ) : (
                          step.num
                        )}
                      </div>
                      <span
                        className={`text-xs font-semibold mt-2 whitespace-nowrap transition-colors ${
                          isCurrent
                            ? "text-[#001f3f] font-bold"
                            : isCompleted
                            ? "text-[#001f3f] group-hover:text-[#12355b]"
                            : "text-[#64748b] group-hover:text-[#1e293b]"
                        }`}
                      >
                        {step.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>



          </section>
        )}

        {/* Global Submit Error */}
        {submitError && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-center gap-3 text-sm font-semibold">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        {/* ==================================================== */}
        {/* STEP 1: APPLICANT DETAILS                            */}
        {/* ==================================================== */}
        {currentStep === 1 && (
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0_4px_6px_-1px_rgba(18,53,91,0.05)] p-6 md:p-8 flex flex-col gap-6">
            <div className="border-l-4 border-secondary-container pl-4 bg-surface-container-low p-4 rounded-r-lg">
              <h3 className="font-label-md text-sm md:text-base font-bold text-primary mb-0.5">
                Step 1: Applicant Details
              </h3>
              <p className="font-body-md text-xs md:text-sm text-on-surface-variant leading-relaxed">
                Please provide your personal information as required by the Right to Information Act, 2005. Ensure the details match your official identification.
              </p>
            </div>

            <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); if (canProceedStep1) changeStep(2); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-sm font-semibold text-on-background" htmlFor="fullName">
                    Full Name <span className="text-error">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={applicant.fullName}
                    onChange={(e) => setApplicant({ ...applicant, fullName: e.target.value })}
                    placeholder="e.g., Rajesh Kumar"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-2xs transition-shadow"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-sm font-semibold text-on-background" htmlFor="email">
                    Email Address <span className="text-error">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={applicant.email}
                    onChange={(e) => setApplicant({ ...applicant, email: e.target.value })}
                    placeholder="e.g., rajesh.kumar@example.com"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-2xs transition-shadow"
                  />
                </div>

                {/* Mobile Number */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="font-label-md text-sm font-semibold text-on-background" htmlFor="mobile">
                    Mobile Number <span className="text-error">*</span>
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-outline-variant bg-surface-container-low text-on-surface-variant font-semibold text-sm">
                      +91
                    </span>
                    <input
                      id="mobile"
                      type="tel"
                      maxLength={10}
                      value={applicant.mobile}
                      onChange={(e) => setApplicant({ ...applicant, mobile: e.target.value.replace(/\D/g, "") })}
                      placeholder="10-digit mobile number"
                      className="flex-1 min-w-0 block w-full px-3 py-3 rounded-r-lg bg-surface-container-lowest border border-outline-variant text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-2xs transition-shadow"
                    />
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-outline-variant/60 my-1"></div>

              {/* Postal Address */}
              <div className="flex flex-col gap-4">
                <h4 className="font-label-md text-sm font-bold text-primary border-b border-surface-container-high pb-2">
                  Postal Address
                </h4>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-sm font-semibold text-on-background" htmlFor="address">
                    Complete Address <span className="text-error">*</span>
                  </label>
                  <textarea
                    id="address"
                    rows={3}
                    value={applicant.address}
                    onChange={(e) => setApplicant({ ...applicant, address: e.target.value })}
                    placeholder="Enter building, street, flat no., and locality"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-2xs transition-shadow resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* State Dropdown */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-sm font-semibold text-on-background" htmlFor="state">
                      State / UT <span className="text-error">*</span>
                    </label>
                    <select
                      id="state"
                      value={applicant.state}
                      onChange={handleStateChange}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-2xs transition-shadow"
                    >
                      <option value="DL">Delhi (NCT)</option>
                      <option value="MH">Maharashtra</option>
                      <option value="UP">Uttar Pradesh</option>
                      <option value="KA">Karnataka</option>
                      <option value="TN">Tamil Nadu</option>
                      <option value="WB">West Bengal</option>
                      <option value="GJ">Gujarat</option>
                      <option value="RJ">Rajasthan</option>
                      <option value="KL">Kerala</option>
                      <option value="TG">Telangana</option>
                    </select>
                  </div>

                  {/* District Dropdown */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-sm font-semibold text-on-background" htmlFor="district">
                      District <span className="text-error">*</span>
                    </label>
                    <select
                      id="district"
                      value={applicant.district}
                      onChange={(e) => setApplicant({ ...applicant, district: e.target.value })}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-2xs transition-shadow"
                    >
                      {(STATE_DISTRICT_MAP[applicant.state] || ["Central District"]).map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Pincode */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-sm font-semibold text-on-background" htmlFor="pincode">
                      Pincode <span className="text-error">*</span>
                    </label>
                    <input
                      id="pincode"
                      type="text"
                      maxLength={6}
                      value={applicant.pincode}
                      onChange={(e) => setApplicant({ ...applicant, pincode: e.target.value.replace(/\D/g, "") })}
                      placeholder="6-digit pincode"
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-2xs transition-shadow"
                    />
                  </div>
                </div>
              </div>
            </form>

            {/* Privacy Note */}
            <div className="mt-2 flex items-start gap-2.5 text-on-surface-variant bg-surface-container-low p-3.5 rounded-lg border border-outline-variant/60">
              <Info className="h-5 w-5 text-outline shrink-0 mt-0.5" />
              <p className="font-caption text-xs leading-relaxed">
                <strong>Privacy Note:</strong> Your personal information will be kept confidential and used solely for the purpose of processing your Right to Information request. It will not be shared with unauthorized third parties.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse md:flex-row justify-between items-center pt-4 border-t border-outline-variant gap-4">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="w-full md:w-auto px-6 py-3 border border-outline text-on-surface-variant font-semibold text-sm rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => changeStep(2)}
                disabled={!canProceedStep1}
                className={`w-full md:w-auto px-8 py-3 font-semibold text-sm rounded-lg transition-all flex justify-center items-center gap-2 shadow-xs cursor-pointer ${
                  canProceedStep1
                    ? "bg-primary text-on-primary hover:bg-primary/90"
                    : "bg-surface-container-high text-on-surface-variant opacity-60 cursor-not-allowed"
                }`}
              >
                Save &amp; Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}

        {/* ==================================================== */}
        {/* STEP 2: APPLICANT CATEGORY (BPL STATUS)              */}
        {/* ==================================================== */}
        {currentStep === 2 && (
          <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0_4px_6px_-1px_rgba(18,53,91,0.05)] p-6 md:p-8 flex flex-col gap-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-primary">
                Applicant Category
              </h2>
              <p className="text-on-surface-variant text-sm mt-1">
                Please confirm your Below Poverty Line (BPL) status to determine fee applicability.
              </p>
            </div>

            {/* Category Subject Tag */}
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-sm font-semibold text-on-surface">
                Subject Classification Category
              </label>
              <select
                value={category.selectedCategoryName}
                onChange={(e) => setCategory({ ...category, selectedCategoryName: e.target.value })}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs"
              >
                <option value="Infrastructure & Transport">Infrastructure &amp; Transport</option>
                <option value="Public Health & Hospitals">Public Health &amp; Hospitals</option>
                <option value="Education & Scholarships">Education &amp; Scholarships</option>
                <option value="Finance & Revenue">Finance &amp; Revenue</option>
                <option value="Environment & Forest">Environment &amp; Forest</option>
                <option value="Public Grievance & General">Public Grievance &amp; General</option>
              </select>
            </div>

            {/* BPL Cardholder Question */}
            <div className="flex flex-col gap-3">
              <label className="font-label-md text-sm font-semibold text-on-surface">
                Do you hold a valid BPL card?
              </label>
              <div className="flex gap-4">
                <label
                  onClick={() => setCategory({ ...category, isBpl: true })}
                  className={`flex items-center gap-2.5 cursor-pointer p-3.5 rounded-xl border transition-all flex-1 ${
                    category.isBpl
                      ? "border-primary bg-primary-fixed-dim/20 ring-2 ring-primary ring-offset-2 ring-offset-surface-container-lowest font-bold text-primary"
                      : "border-outline-variant hover:bg-surface-container-low text-on-surface"
                  }`}
                >
                  <input
                    type="radio"
                    name="bpl_status"
                    checked={category.isBpl}
                    onChange={() => setCategory({ ...category, isBpl: true })}
                    className="w-4 h-4 text-primary"
                  />
                  <span>Yes (BPL Cardholder)</span>
                </label>

                <label
                  onClick={() => setCategory({ ...category, isBpl: false })}
                  className={`flex items-center gap-2.5 cursor-pointer p-3.5 rounded-xl border transition-all flex-1 ${
                    !category.isBpl
                      ? "border-primary bg-primary-fixed-dim/20 ring-2 ring-primary ring-offset-2 ring-offset-surface-container-lowest font-bold text-primary"
                      : "border-outline-variant hover:bg-surface-container-low text-on-surface"
                  }`}
                >
                  <input
                    type="radio"
                    name="bpl_status"
                    checked={!category.isBpl}
                    onChange={() => setCategory({ ...category, isBpl: false })}
                    className="w-4 h-4 text-primary"
                  />
                  <span>No (General / APL)</span>
                </label>
              </div>
            </div>

            {/* BPL Section (If Yes selected) */}
            {category.isBpl && (
              <div className="flex flex-col gap-4 p-5 bg-surface-container-low rounded-xl border-l-4 border-secondary transition-all">
                <div className="flex items-start gap-2.5">
                  <Info className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-label-md text-sm font-bold text-on-surface">
                      BPL Fee Exemption
                    </h3>
                    <p className="font-body-md text-xs md:text-sm text-on-surface-variant mt-0.5">
                      As a verified BPL cardholder, you are exempt from the standard ₹10 RTI application fee under Section 7(5) of the RTI Act.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-sm font-semibold text-on-surface" htmlFor="bplNumber">
                    BPL Card Number <span className="text-error">*</span>
                  </label>
                  <input
                    id="bplNumber"
                    type="text"
                    value={category.bplNumber}
                    onChange={(e) => setCategory({ ...category, bplNumber: e.target.value })}
                    placeholder="Enter alphanumeric BPL card / ration number"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-none shadow-2xs"
                  />
                </div>

                {/* BPL Certificate File Upload */}
                <div className="flex flex-col gap-2 mt-1">
                  <label className="font-label-md text-sm font-semibold text-on-surface">
                    Upload BPL Certificate / Card Copy
                  </label>
                  <label className="border-2 border-dashed border-outline-variant rounded-xl p-6 flex flex-col items-center justify-center gap-2 bg-surface-container-lowest hover:bg-surface-container-low hover:border-primary transition-all cursor-pointer group">
                    <UploadCloud className="h-8 w-8 text-on-surface-variant group-hover:text-primary transition-colors" />
                    <div className="text-center text-sm">
                      <span className="font-bold text-primary group-hover:underline">Click to upload</span>
                      <span className="text-on-surface-variant"> or drag and drop</span>
                    </div>
                    <p className="text-xs text-outline">PDF, JPG, PNG up to 2MB</p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        handleFileUpload("bpl", file);
                      }}
                    />
                  </label>
                  {documents.bplDocName && (
                    <div className="flex items-center justify-between p-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs font-semibold text-primary">
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" /> {documents.bplDocName}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setDocuments((prev) => ({ ...prev, bplDocName: "" }));
                          setCategory((prev) => ({ ...prev, bplFileName: "" }));
                        }}
                        className="text-error hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-outline-variant">
              <button
                type="button"
                onClick={() => changeStep(1)}
                className="px-6 py-3 border border-outline text-on-surface-variant font-semibold text-sm rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => changeStep(3)}
                disabled={!canProceedStep2}
                className={`px-8 py-3 font-semibold text-sm rounded-lg transition-all flex items-center gap-2 shadow-xs cursor-pointer ${
                  canProceedStep2
                    ? "bg-primary text-on-primary hover:bg-primary/90"
                    : "bg-surface-container-high text-on-surface-variant opacity-60 cursor-not-allowed"
                }`}
              >
                Save &amp; Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}

        {/* ==================================================== */}
        {/* STEP 3: SELECT PUBLIC AUTHORITY                      */}
        {/* ==================================================== */}
        {currentStep === 3 && (
          <section className="flex flex-col gap-6">
            {/* Warning Disclaimer Card */}
            <div className="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-secondary-container rounded-r-xl p-5 shadow-2xs">
              <div className="flex gap-3.5 items-start">
                <AlertTriangle className="h-5 w-5 text-secondary-container mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-label-md text-sm md:text-base font-bold text-on-surface">
                    Important Notice Regarding Jurisdiction
                  </h3>
                  <p className="font-body-md text-xs md:text-sm text-on-surface-variant mt-1 leading-relaxed">
                    This portal is exclusively for filing RTI requests with <strong>Central Government Ministries/Departments</strong> and other Central Public Authorities. For State Government authorities, please visit the respective state's RTI portal.
                  </p>
                </div>
              </div>
            </div>

            {/* Search & Filter Card */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 md:p-8 shadow-[0_4px_6px_-1px_rgba(18,53,91,0.05)] flex flex-col gap-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="text"
                  value={authority.searchQuery}
                  onChange={(e) => {
                    const q = e.target.value;
                    setAuthority((prev) => ({ ...prev, searchQuery: q }));
                    // Auto match ministry if found
                    const found = MINISTRIES_DATA.find(
                      (m) =>
                        m.ministry.toLowerCase().includes(q.toLowerCase()) ||
                        m.departments.some((d) => d.toLowerCase().includes(q.toLowerCase()))
                    );
                    if (found) {
                      setAuthority((prev) => ({
                        ...prev,
                        ministry: found.ministry,
                        department: found.departments[0],
                      }));
                    }
                  }}
                  placeholder="Search for Ministry, Department, or Subject (e.g., 'Finance', 'Highways')..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-outline-variant bg-surface text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-2xs transition-shadow"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-sm font-semibold text-on-surface">
                    Select Ministry / Apex Body <span className="text-error">*</span>
                  </label>
                  <select
                    value={authority.ministry}
                    onChange={(e) => {
                      const selectedMin = e.target.value;
                      const match = MINISTRIES_DATA.find((m) => m.ministry === selectedMin);
                      setAuthority({
                        ...authority,
                        ministry: selectedMin,
                        department: match ? match.departments[0] : "General Secretariat",
                      });
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs"
                  >
                    {MINISTRIES_DATA.map((item) => (
                      <option key={item.ministry} value={item.ministry}>
                        {item.ministry}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-sm font-semibold text-on-surface">
                    Select Public Authority / Department <span className="text-error">*</span>
                  </label>
                  <select
                    value={authority.department}
                    onChange={(e) => setAuthority({ ...authority, department: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-2xs"
                  >
                    {(
                      MINISTRIES_DATA.find((m) => m.ministry === authority.ministry)?.departments || [
                        "Central Secretariat",
                      ]
                    ).map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Currently Selected Authority Confirmation Card */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-2xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pl-2">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-xs mb-2 font-bold">
                    Currently Selected Authority
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-primary">
                    {authority.ministry}
                  </h2>
                  <p className="text-sm text-on-surface-variant mt-0.5">
                    {authority.department}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const searchInput = document.querySelector("input[type='text']") as HTMLInputElement;
                    if (searchInput) searchInput.focus();
                  }}
                  className="px-4 py-2 border border-outline text-primary font-semibold text-xs rounded-lg hover:bg-surface-container-low transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Change Selection
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => changeStep(2)}
                className="px-6 py-3 border border-outline text-on-surface-variant font-semibold text-sm rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => changeStep(4)}
                disabled={!canProceedStep3}
                className={`px-8 py-3 font-semibold text-sm rounded-lg transition-all flex items-center gap-2 shadow-xs cursor-pointer ${
                  canProceedStep3
                    ? "bg-primary text-on-primary hover:bg-primary/90"
                    : "bg-surface-container-high text-on-surface-variant opacity-60 cursor-not-allowed"
                }`}
              >
                Save &amp; Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}

        {/* ==================================================== */}
        {/* STEP 4: REQUEST DETAILS (MANUAL DRAFTING)            */}
        {/* ==================================================== */}
        {currentStep === 4 && (
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 shadow-[0_4px_6px_-1px_rgba(18,53,91,0.05)] flex flex-col gap-6">
            {/* Writing Tips Instruction Banner */}
            <div className="border-l-4 border-secondary-container bg-surface-container-low p-4 rounded-r-lg">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-secondary-container shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-label-md text-sm font-bold text-on-surface">Writing Tips</h3>
                  <p className="font-caption text-xs md:text-sm text-on-surface-variant mt-1 leading-relaxed">
                    Be specific about the documents you are seeking. Mention exact time periods, file numbers if known, and keep the request concise to avoid rejection under Section 6 of the Act.
                  </p>
                </div>
              </div>
            </div>

            {/* Subject Line */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-sm font-semibold text-on-surface" htmlFor="subject">
                Subject of Query <span className="text-error">*</span>
              </label>
              <input
                id="subject"
                type="text"
                value={requestDetails.subject}
                onChange={(e) => setRequestDetails({ ...requestDetails, subject: e.target.value })}
                placeholder="e.g., Information regarding sanctioned funds for public road project"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-sm text-on-surface focus:ring-2 focus:ring-primary focus:outline-none shadow-2xs"
              />
            </div>

            {/* RTI Textarea */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="font-label-md text-sm font-semibold text-on-surface" htmlFor="rti-text">
                  RTI Application Text <span className="text-error">*</span>
                </label>
                <span className="text-xs text-on-surface-variant">Supports English and Hindi</span>
              </div>
              <textarea
                id="rti-text"
                rows={12}
                maxLength={3000}
                value={requestDetails.requestText}
                onChange={(e) => setRequestDetails({ ...requestDetails, requestText: e.target.value })}
                placeholder="Draft your RTI query here. Specify numbered points and certified document requests..."
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-4 font-mono text-sm text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-y transition-shadow leading-relaxed"
              ></textarea>
              <div className="flex justify-between items-center mt-1">
                <span className="font-caption text-xs text-on-surface-variant">
                  Limit: 3000 characters (as per DoPT guidelines)
                </span>
                <span className="font-caption text-xs text-on-surface-variant font-semibold">
                  <strong className="text-primary">{requestDetails.requestText.length}</strong> / 3000 characters
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-outline-variant">
              <button
                type="button"
                onClick={() => changeStep(3)}
                className="px-6 py-3 border border-outline text-on-surface-variant font-semibold text-sm rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => changeStep(5)}
                disabled={!canProceedStep4}
                className={`px-8 py-3 font-semibold text-sm rounded-lg transition-all flex items-center gap-2 shadow-xs cursor-pointer ${
                  canProceedStep4
                    ? "bg-primary text-on-primary hover:bg-primary/90"
                    : "bg-surface-container-high text-on-surface-variant opacity-60 cursor-not-allowed"
                }`}
              >
                Save &amp; Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}

        {/* ==================================================== */}
        {/* STEP 5: DOCUMENTS UPLOAD (DEDICATED STEP)           */}
        {/* ==================================================== */}
        {currentStep === 5 && (
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 shadow-[0_4px_6px_-1px_rgba(18,53,91,0.05)] flex flex-col gap-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-primary">
                Supporting Documents (Optional)
              </h2>
              <p className="text-on-surface-variant text-sm mt-1">
                Attach any relevant reference documents, previous government replies, notices, or identity verification files.
              </p>
            </div>

            {/* Document Upload Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Primary Supporting Document */}
              <div className="border border-dashed border-outline-variant rounded-xl p-6 flex flex-col items-center justify-center bg-surface-container-low hover:border-primary transition-all">
                <UploadCloud className="h-8 w-8 text-outline mb-2" />
                <p className="font-label-md text-sm font-bold text-on-surface text-center">
                  Primary Supporting Document
                </p>
                <p className="font-caption text-xs text-on-surface-variant text-center mb-4">
                  Official notices, tenders, or correspondence (PDF/JPG up to 5MB)
                </p>

                {documents.primaryDocName ? (
                  <div className="w-full flex items-center justify-between p-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs font-semibold text-primary">
                    <span className="flex items-center gap-1.5 truncate max-w-[180px]">
                      <Paperclip className="h-3.5 w-3.5" /> {documents.primaryDocName}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDocuments((prev) => ({ ...prev, primaryDocName: "" }))}
                      className="text-error hover:underline cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border border-outline text-primary font-semibold text-xs px-4 py-2 rounded-lg hover:bg-surface-container-lowest transition-colors cursor-pointer">
                    Choose File
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => handleFileUpload("primary", e.target.files?.[0] || null)}
                    />
                  </label>
                )}
              </div>

              {/* ID / Address Proof (Optional) */}
              <div className="border border-dashed border-outline-variant rounded-xl p-6 flex flex-col items-center justify-center bg-surface-container-low hover:border-primary transition-all">
                <UploadCloud className="h-8 w-8 text-outline mb-2" />
                <p className="font-label-md text-sm font-bold text-on-surface text-center">
                  Identity / Address Verification
                </p>
                <p className="font-caption text-xs text-on-surface-variant text-center mb-4">
                  Aadhaar / Voter ID / Passport (Optional, PDF/JPG up to 5MB)
                </p>

                {documents.idProofName ? (
                  <div className="w-full flex items-center justify-between p-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs font-semibold text-primary">
                    <span className="flex items-center gap-1.5 truncate max-w-[180px]">
                      <Paperclip className="h-3.5 w-3.5" /> {documents.idProofName}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDocuments((prev) => ({ ...prev, idProofName: "" }))}
                      className="text-error hover:underline cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border border-outline text-primary font-semibold text-xs px-4 py-2 rounded-lg hover:bg-surface-container-lowest transition-colors cursor-pointer">
                    Choose File
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => handleFileUpload("idProof", e.target.files?.[0] || null)}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Document Guidelines Notice */}
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 text-xs text-on-surface-variant flex items-start gap-2.5">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-on-surface">Data Security: </span>
                All uploaded files are scanned for safety and stored in an encrypted government repository. They will only be accessible to the designated Nodal Officer and CPIO.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-outline-variant">
              <button
                type="button"
                onClick={() => changeStep(4)}
                className="px-6 py-3 border border-outline text-on-surface-variant font-semibold text-sm rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                type="button"
                onClick={() => changeStep(6)}
                className="px-8 py-3 bg-primary text-on-primary font-semibold text-sm rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                Proceed to Review <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}

        {/* ==================================================== */}
        {/* STEP 6: REVIEW YOUR RTI APPLICATION                  */}
        {/* ==================================================== */}
        {currentStep === 6 && (
          <section className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-primary">
                  Review Your RTI Application
                </h2>
                <p className="text-on-surface-variant text-sm mt-0.5">
                  Please carefully verify the details below before submitting.
                </p>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 text-primary hover:underline text-xs font-bold cursor-pointer"
              >
                <Printer className="h-4 w-4" /> Print Copy
              </button>
            </div>

            {/* Review Cards */}
            <div className="flex flex-col gap-4">
              {/* Section 1: Applicant Details Card */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 md:p-6 shadow-2xs">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-outline-variant">
                  <h3 className="font-headline-md text-base font-bold text-primary flex items-center gap-2">
                    Applicant Details
                  </h3>
                  <button
                    type="button"
                    onClick={() => changeStep(1)}
                    className="text-secondary hover:text-primary transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
                  >
                    <Edit className="h-3.5 w-3.5" /> Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-caption text-xs text-on-surface-variant block">Full Name</span>
                    <span className="font-semibold text-on-surface">{applicant.fullName || "Rajesh Kumar Sharma"}</span>
                  </div>
                  <div>
                    <span className="font-caption text-xs text-on-surface-variant block">Email Address</span>
                    <span className="font-semibold text-on-surface">{applicant.email || "rajesh.ks@example.com"}</span>
                  </div>
                  <div>
                    <span className="font-caption text-xs text-on-surface-variant block">Mobile Number</span>
                    <span className="font-semibold text-on-surface">+91 {applicant.mobile || "9876543210"}</span>
                  </div>
                  <div>
                    <span className="font-caption text-xs text-on-surface-variant block">Poverty Line Status</span>
                    <span className="font-semibold text-on-surface">
                      {category.isBpl ? `Below Poverty Line (BPL - ${category.bplNumber || "Card Verified"})` : "Above Poverty Line (APL)"}
                    </span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-caption text-xs text-on-surface-variant block">Postal Address</span>
                    <span className="text-on-surface">
                      {applicant.address || "12, Secretariat Road"}, {applicant.district}, {applicant.state} - {applicant.pincode || "110001"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Category & Authority Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-2xs">
                  <div className="flex justify-between items-center mb-3 pb-2.5 border-b border-outline-variant">
                    <h3 className="text-sm font-bold text-primary">Category</h3>
                    <button
                      type="button"
                      onClick={() => changeStep(2)}
                      className="text-secondary hover:text-primary transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5" /> Edit
                    </button>
                  </div>
                  <div>
                    <span className="font-caption text-xs text-on-surface-variant block mb-1">Selected Category</span>
                    <span className="inline-block px-3 py-1 bg-surface-container-low border border-outline-variant rounded-full text-xs font-bold text-on-surface">
                      {category.selectedCategoryName}
                    </span>
                  </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-2xs">
                  <div className="flex justify-between items-center mb-3 pb-2.5 border-b border-outline-variant">
                    <h3 className="text-sm font-bold text-primary">Public Authority</h3>
                    <button
                      type="button"
                      onClick={() => changeStep(3)}
                      className="text-secondary hover:text-primary transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5" /> Edit
                    </button>
                  </div>
                  <div>
                    <span className="font-caption text-xs text-on-surface-variant block mb-0.5">Target Ministry/Department</span>
                    <span className="font-bold text-on-surface text-sm block">{authority.ministry}</span>
                    <span className="text-xs text-on-surface-variant block">{authority.department}</span>
                  </div>
                </div>
              </div>

              {/* Section 3: RTI Request Text Card */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 md:p-6 shadow-2xs">
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-outline-variant">
                  <h3 className="text-base font-bold text-primary">RTI Request Detail</h3>
                  <button
                    type="button"
                    onClick={() => changeStep(4)}
                    className="text-secondary hover:text-primary transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
                  >
                    <Edit className="h-3.5 w-3.5" /> Edit
                  </button>
                </div>
                <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant mb-3 max-h-60 overflow-y-auto">
                  <p className="font-mono text-xs md:text-sm text-on-surface whitespace-pre-wrap leading-relaxed">
                    {requestDetails.requestText}
                  </p>
                </div>
                <div className="flex flex-wrap justify-between items-center gap-2 text-xs">
                  <span className="text-on-surface-variant">
                    Character count: <strong className="text-on-surface">{requestDetails.requestText.length}</strong> / 3000
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-on-surface-variant">Attached Documents:</span>
                    <span className="inline-flex items-center gap-1 bg-surface-container border border-outline-variant px-2.5 py-0.5 rounded-full text-xs font-semibold">
                      <Paperclip className="h-3 w-3" />
                      {documents.primaryDocName || documents.idProofName || documents.bplDocName
                        ? [documents.primaryDocName, documents.idProofName, documents.bplDocName].filter(Boolean).join(", ")
                        : "None attached"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Declarations & Acknowledgements */}
              <div className="border-l-4 border-secondary bg-surface-container-lowest p-5 rounded-r-xl border border-outline-variant shadow-2xs flex flex-col gap-3">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={declarations.confirmTrue}
                    onChange={(e) => setDeclarations({ ...declarations, confirmTrue: e.target.checked })}
                    className="mt-1 w-4 h-4 text-primary bg-surface border-outline-variant rounded focus:ring-primary"
                  />
                  <span className="text-xs md:text-sm text-on-surface group-hover:text-primary transition-colors leading-relaxed">
                    I confirm that the information provided above is true and accurate to the best of my knowledge. I understand that false information may lead to rejection of my RTI application.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={declarations.confirmReviewed}
                    onChange={(e) => setDeclarations({ ...declarations, confirmReviewed: e.target.checked })}
                    className="mt-1 w-4 h-4 text-primary bg-surface border-outline-variant rounded focus:ring-primary"
                  />
                  <span className="text-xs md:text-sm text-on-surface group-hover:text-primary transition-colors leading-relaxed">
                    I have read and verified the complete application body and confirm that I am a citizen of India as required under Section 3 of the Right to Information Act, 2005.
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-3 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => changeStep(5)}
                  className="px-6 py-3 border border-outline text-on-surface-variant font-semibold text-sm rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => changeStep(7)}
                  disabled={!canProceedStep6}
                  className={`px-8 py-3.5 font-bold text-sm rounded-lg transition-all flex items-center gap-2 shadow-xs cursor-pointer ${
                    canProceedStep6
                      ? "bg-primary text-on-primary hover:bg-primary/90"
                      : "bg-surface-container-high text-on-surface-variant opacity-60 cursor-not-allowed"
                  }`}
                >
                  Proceed to Payment <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================== */}
        {/* STEP 7: APPLICATION FEE & PAYMENT (DUMMY GATEWAY)    */}
        {/* ==================================================== */}
        {currentStep === 7 && (
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

                  {category.isBpl ? (
                    <div className="p-4 bg-surface-container-low rounded-lg border-l-4 border-secondary text-sm">
                      <div className="font-bold text-primary">BPL Cardholder Exemption Applied</div>
                      <p className="text-on-surface-variant text-xs mt-1">
                        Under Section 7(5) of the RTI Act, no fee is payable by citizens belonging to the Below Poverty Line category.
                      </p>
                    </div>
                  ) : (
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
                  )}
                </div>

                {/* Security Disclaimer Notice */}
                <div className="flex items-start gap-3 p-3.5 bg-surface-container border-l-4 border-secondary rounded-r-lg">
                  <ShieldCheck className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <p className="font-caption text-xs text-on-surface-variant leading-relaxed">
                    You will be securely routed through the Non-Tax Receipt Portal (NTRP) / Bharatkosh SBI ePay Payment Gateway. Do not refresh or press back while the transaction is being verified.
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
                      <span className="font-semibold">
                        {category.isBpl ? "₹0.00 (Exempt)" : "₹10.00"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-on-surface-variant text-xs">
                      <span>Processing Convenience Fee</span>
                      <span>₹0.00</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="font-headline-md text-lg font-bold text-primary">Total Payable</span>
                    <span className="font-headline-md text-xl font-extrabold text-primary">
                      {category.isBpl ? "₹0.00" : "₹10.00"}
                    </span>
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
                        {category.isBpl ? "Submit (BPL Exemption)" : "Pay ₹10"} <ArrowRight className="h-4 w-4" />
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
                  onClick={() => changeStep(6)}
                  className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Review
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================== */}
        {/* STEP 8: SUBMISSION CONFIRMATION & RECEIPT            */}
        {/* ==================================================== */}
        {currentStep === 8 && submissionResult && (
          <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-lg p-8 md:p-12 flex flex-col items-center text-center gap-6 max-w-2xl mx-auto my-4">
            <div className="w-16 h-16 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shadow-sm">
              <Check className="h-8 w-8 text-on-tertiary-container" strokeWidth={3} />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-secondary-container bg-surface-container-low px-3 py-1 rounded-full">
                Application Filed Successfully
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mt-3">
                RTI Application Submitted
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
