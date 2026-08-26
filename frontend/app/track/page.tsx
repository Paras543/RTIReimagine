"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";
import { FileRtiChoiceModal } from "@/components/file-rti-choice-modal";
import { Button } from "@/components/ui/button";
import {
  Landmark,
  Search,
  Check,
  RotateCw,
  Info,
  Download,
  Gavel,
  Printer,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { LanguageSelector } from "@/components/language-selector";


interface TimelineEvent {
  title: string;
  date_time: string;
  description?: string;
  status: "completed" | "current" | "pending";
  assigned_to?: string;
}

interface ApplicationStatusData {
  application_id: string;
  authority_name: string;
  department?: string;
  submitted_date: string;
  type: "RTI Request" | "First Appeal";
  stage: "Submitted" | "Received" | "Processing" | "Response Received";
  status_label: string;
  estimated_resolution?: string;
  days_remaining: number;
  questions: string[];
  timeline: TimelineEvent[];
  can_appeal: boolean;
}

interface HistoryItem {
  application_id: string;
  authority_name: string;
  submitted_date: string;
  type: "RTI Request" | "First Appeal";
  status: string;
  stage: string;
  days_remaining: number;
}

const DEFAULT_STATUS_DATA: ApplicationStatusData = {
  application_id: "RTI/2026/XXXXXXX",
  authority_name: "Ministry of Home Affairs",
  department: "Central Secretariat",
  submitted_date: "Aug 23, 2026",
  type: "RTI Request",
  stage: "Processing",
  status_label: "Under Process",
  estimated_resolution: "Sep 22, 2026",
  days_remaining: 28,
  questions: [
    "Certified copy of administrative sanctions for project contracts.",
    "Total expenditure incurred during the financial year.",
  ],
  timeline: [
    {
      title: "Request Submitted",
      date_time: "Aug 23, 2026 • 10:45 AM",
      description: "Application successfully logged into the central portal.",
      status: "completed",
    },
    {
      title: "Received by Nodal Officer",
      date_time: "Aug 24, 2026 • 09:15 AM",
      description: "",
      status: "completed",
    },
    {
      title: "Forwarded to CPIO",
      date_time: "Aug 25, 2026 • 02:30 PM",
      description: "Assigned to: Central Public Information Officer (Internal Security Div.)",
      status: "completed",
      assigned_to: "Central Public Information Officer (Internal Security Div.)",
    },
    {
      title: "Response Pending",
      date_time: "Estimated resolution by Sep 22, 2026",
      description: "",
      status: "current",
    },
  ],
  can_appeal: false,
};

const SAMPLE_HISTORY: HistoryItem[] = [
  {
    application_id: "RTI/2026/XXXXXXX",
    authority_name: "Ministry of Home Affairs",
    submitted_date: "Aug 23, 2026",
    type: "RTI Request",
    status: "Under Process",
    stage: "Processing",
    days_remaining: 28,
  },
  {
    application_id: "RTI/2025/ABC8921",
    authority_name: "Department of Revenue",
    submitted_date: "Nov 12, 2025",
    type: "First Appeal",
    status: "Resolved",
    stage: "Response Received",
    days_remaining: 0,
  },
  {
    application_id: "RTI/2025/XYZ3344",
    authority_name: "Ministry of Defence",
    submitted_date: "Sep 05, 2025",
    type: "RTI Request",
    status: "Resolved",
    stage: "Response Received",
    days_remaining: 0,
  },
];

function TrackAndHistoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { t } = useLanguage();

  const initialScreen = searchParams.get("screen") === "screen2" ? "screen2" : "screen1";
  const [activeScreen, setActiveScreen] = useState<"screen1" | "screen2">(initialScreen);
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);

  // Screen 1 State
  const [searchRegNo, setSearchRegNo] = useState("");
  const [currentAppId, setCurrentAppId] = useState(searchParams.get("id") || "RTI/2026/XXXXXXX");
  const [appData, setAppData] = useState<ApplicationStatusData>(DEFAULT_STATUS_DATA);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  // Screen 2 State
  const [historyFilter, setHistoryFilter] = useState<"all" | "active" | "completed">("all");
  const [historySearch, setHistorySearch] = useState("");
  const [historyList, setHistoryList] = useState<HistoryItem[]>(SAMPLE_HISTORY);
  const [currentPage, setCurrentPage] = useState(1);

  // Update active screen from query params if changed
  useEffect(() => {
    const screenParam = searchParams.get("screen");
    if (screenParam === "screen2") {
      setActiveScreen("screen2");
    } else if (screenParam === "screen1") {
      setActiveScreen("screen1");
    }
  }, [searchParams]);

  // Sync initial query param ID or load default
  useEffect(() => {
    if (!isSignedIn) return;
    const idFromParam = searchParams.get("id") || "RTI/2026/XXXXXXX";
    setCurrentAppId(idFromParam);
    fetchApplicationStatus(idFromParam);
  }, [isSignedIn, searchParams]);

  // Dynamic live fetch for History list from backend
  useEffect(() => {
    if (!isSignedIn) return;
    const fetchHistoryFromBackend = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (historyFilter !== "all") queryParams.set("status_filter", historyFilter);
        if (historySearch.trim()) queryParams.set("search", historySearch.trim());

        const res = await fetch(`/api/proxy/applications?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.items) {
            setHistoryList(data.items);
          }
        }
      } catch {
        // Fallback to sample data on connection failure
      }
    };

    fetchHistoryFromBackend();
  }, [isSignedIn, historyFilter, historySearch]);

  const fetchApplicationStatus = async (appId: string) => {
    setIsLoadingStatus(true);
    try {
      const res = await fetch(`/api/proxy/applications/${encodeURIComponent(appId)}`);
      if (res.ok) {
        const data = await res.json();
        setAppData(data);
      } else {
        // Dynamic deterministic fallback for custom search
        setAppData({
          ...DEFAULT_STATUS_DATA,
          application_id: appId.toUpperCase(),
        });
      }
    } catch {
      setAppData({
        ...DEFAULT_STATUS_DATA,
        application_id: appId.toUpperCase(),
      });
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const handleSearchStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRegNo.trim()) return;
    const cleanId = searchRegNo.trim().toUpperCase();
    setCurrentAppId(cleanId);
    fetchApplicationStatus(cleanId);
  };

  const switchScreen = (screenId: "screen1" | "screen2") => {
    setActiveScreen(screenId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewDetails = (appId: string) => {
    setCurrentAppId(appId);
    fetchApplicationStatus(appId);
    switchScreen("screen1");
  };

  const handleDownloadReceipt = () => {
    const receiptContent = `=====================================================
RTI ONLINE - APPLICATION RECEIPT
Government of India | Department of Personnel & Training
=====================================================
Registration Number : ${appData.application_id}
Public Authority    : ${appData.authority_name}, ${appData.department || "Central Secretariat"}
Submission Date     : ${appData.submitted_date}
Current Status      : ${appData.status_label}
Estimated Due Date  : ${appData.estimated_resolution || "Within 30 days"}

Requested Questions:
${appData.questions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Statutory Mandate: RTI Act, 2005 (Section 7(1))
=====================================================`;

    const blob = new Blob([receiptContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `RTI_Receipt_${appData.application_id.replace(/[/\\?%*:|"<>]/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintForm = () => {
    window.print();
  };

  // Filter history items
  const filteredHistory = historyList.filter((item) => {
    const matchesFilter =
      historyFilter === "all" ||
      (historyFilter === "active" && item.status.toLowerCase().includes("process")) ||
      (historyFilter === "completed" && item.status.toLowerCase().includes("resolved"));

    const matchesSearch =
      !historySearch.trim() ||
      item.application_id.toLowerCase().includes(historySearch.toLowerCase()) ||
      item.authority_name.toLowerCase().includes(historySearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // 1. Session Loading State
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <RotateCw className="h-8 w-8 text-primary animate-spin" />
        <span className="text-on-surface-variant font-medium text-sm">Verifying citizen session...</span>
      </div>
    );
  }

  // 2. Unauthenticated State: Citizen Sign-In Required Gate (Hides status & history)
  if (!isSignedIn) {
    return (
      <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
        {/* TopNavBar for Logged-Out Citizens */}
        <header className="bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-40 shadow-xs">
          <div className="flex justify-between items-center px-4 md:px-8 w-full max-w-7xl mx-auto h-[64px]">
            <Link href="/" className="font-headline-md text-xl font-bold text-primary flex items-center gap-2.5">
              <Landmark className="h-6 w-6 text-primary shrink-0" />
              <span>RTI Online</span>
            </Link>
            <nav className="hidden md:flex gap-6 items-center h-full">
              <Link className="font-body-md text-on-surface-variant hover:text-primary transition-colors flex items-center h-full hover:bg-surface-container-low px-3 font-medium text-[15px]" href="/">
                Home
              </Link>
              <SignInButton mode="modal">
                <button
                  className="font-body-md text-on-surface-variant hover:text-primary transition-colors flex items-center h-full hover:bg-surface-container-low px-3 cursor-pointer font-medium text-[15px]"
                >
                  {t.navCopilot}
                </button>
              </SignInButton>
              <button
                onClick={() => setIsChoiceModalOpen(true)}
                className="font-body-md text-on-surface-variant hover:text-primary transition-colors flex items-center h-full hover:bg-surface-container-low px-3 cursor-pointer font-medium text-[15px]"
              >
                File RTI
              </button>
              <SignInButton mode="modal">
                <button
                  className="font-body-md text-on-surface-variant hover:text-primary transition-colors flex items-center h-full hover:bg-surface-container-low px-3 cursor-pointer font-medium text-[15px]"
                >
                  Track Status
                </button>
              </SignInButton>
              <SignInButton mode="modal">
                <button
                  className="font-body-md text-on-surface-variant hover:text-primary transition-colors flex items-center h-full hover:bg-surface-container-low px-3 cursor-pointer font-medium text-[15px]"
                >
                  My History
                </button>
              </SignInButton>
              <Link className="font-body-md text-on-surface-variant hover:text-primary transition-colors flex items-center h-full hover:bg-surface-container-low px-3 font-medium text-[15px]" href="/faq">
                FAQ
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <LanguageSelector />
              <SignInButton mode="modal">
                <button className="font-label-md text-sm text-primary border border-outline-variant hover:bg-surface-container-low px-4 py-2 rounded-lg transition-colors font-semibold cursor-pointer">
                  Login / Register
                </button>
              </SignInButton>
              <button
                onClick={() => setIsChoiceModalOpen(true)}
                className="bg-secondary-container text-on-secondary-container font-label-md text-sm px-4 py-2 rounded-lg font-bold hover:brightness-105 transition-all shadow-xs cursor-pointer"
              >
                File New Request
              </button>
            </div>
          </div>
        </header>

        {/* Main Content: Official Citizen Login Required Gate */}
        <main className="flex-grow flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-lg bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 md:p-10 shadow-sm flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed mb-5">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>

            <span className="font-caption text-xs uppercase tracking-wider font-bold text-on-surface-variant mb-1">
              Official RTI Citizen Portal
            </span>

            <h1 className="font-headline-md text-2xl md:text-3xl font-bold text-primary mb-3">
              Citizen Login Required
            </h1>

            <p className="font-body-md text-sm md:text-base text-on-surface-variant leading-relaxed mb-8">
              To track the real-time status of your submitted RTI requests or view your complete RTI filing history, please sign in to your official citizen account.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <SignInButton mode="modal">
                <Button className="flex-1 bg-primary text-on-primary font-semibold py-3 h-11 rounded-lg hover:bg-primary-container transition-colors cursor-pointer flex items-center justify-center gap-2">
                  Sign In / Register <ArrowRight className="h-4 w-4" />
                </Button>
              </SignInButton>

              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full border-outline-variant text-on-surface font-semibold py-3 h-11 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer">
                  Return to Home
                </Button>
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-outline-variant/60 w-full text-xs text-on-surface-variant">
              Department of Personnel &amp; Training • Government of India
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-primary text-on-primary font-caption text-xs full-width bottom-0 mt-auto border-t border-primary-container">
          <div className="w-full py-5 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-4">
            <div className="font-label-md text-xs font-bold text-on-primary">
              © 2024 RTI Online. Designed and Developed by National Informatics Centre (NIC).
            </div>
            <div className="flex flex-wrap gap-5 justify-center">
              <Link className="text-on-primary opacity-80 hover:opacity-100 hover:text-secondary-fixed cursor-pointer transition-opacity" href="/faq">
                Help Desk
              </Link>
            </div>
          </div>
        </footer>

        <FileRtiChoiceModal
          isOpen={isChoiceModalOpen}
          onClose={() => setIsChoiceModalOpen(false)}
          onSelectCopilot={() => {
            setIsChoiceModalOpen(false);
            router.push("/copilot");
          }}
          onSelectManual={() => {
            setIsChoiceModalOpen(false);
            router.push("/file-rti");
          }}
        />
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">


      {/* ========================================== */}
      {/* SCREEN 1: STATUS DASHBOARD                 */}
      {/* ========================================== */}
      <div className={`app-screen flex-grow flex flex-col ${activeScreen === "screen1" ? "active block" : "hidden"}`} id="screen1">
        {/* TopNavBar */}
        <header className="bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-40 shadow-xs">
          <div className="flex justify-between items-center px-4 md:px-8 w-full max-w-7xl mx-auto h-[64px]">
            <Link href="/" className="font-headline-md text-xl font-bold text-primary flex items-center gap-2.5">
              <Landmark className="h-6 w-6 text-primary shrink-0" />
              <span>RTI Online</span>
            </Link>
            <nav className="hidden md:flex gap-6 items-center h-full">
              <Link className="font-body-md text-on-surface-variant hover:text-primary transition-colors flex items-center h-full hover:bg-surface-container-low px-3 font-medium text-[15px]" href="/">
                Home
              </Link>
              <Link
                className="font-body-md text-on-surface-variant hover:text-primary transition-colors flex items-center h-full hover:bg-surface-container-low px-3 font-medium text-[15px]"
                href="/copilot"
              >
                {t.navCopilot}
              </Link>
              <button
                onClick={() => setIsChoiceModalOpen(true)}
                className="font-body-md text-on-surface-variant hover:text-primary transition-colors flex items-center h-full hover:bg-surface-container-low px-3 cursor-pointer font-medium text-[15px]"
              >
                File RTI
              </button>
              {/* Active Logic Applied */}
              <button
                onClick={() => switchScreen("screen1")}
                className="font-body-md text-primary font-bold border-b-2 border-secondary-container flex items-center h-full px-3 text-[15px] opacity-90 cursor-pointer"
              >
                Track Status
              </button>
              <button
                onClick={() => switchScreen("screen2")}
                className="font-body-md text-on-surface-variant hover:text-primary transition-colors flex items-center h-full hover:bg-surface-container-low px-3 cursor-pointer font-medium text-[15px]"
              >
                My History
              </button>
              <Link className="font-body-md text-on-surface-variant hover:text-primary transition-colors flex items-center h-full hover:bg-surface-container-low px-3 font-medium text-[15px]" href="/faq">
                FAQ
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <LanguageSelector />
              {isSignedIn ? (
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9",
                    },
                  }}
                />
              ) : (
                <SignInButton mode="modal">
                  <button className="hidden md:block font-label-md text-sm text-on-surface-variant hover:text-primary px-3 py-1.5 transition-colors font-semibold cursor-pointer">
                    Login / Register
                  </button>
                </SignInButton>
              )}
              <button
                onClick={() => setIsChoiceModalOpen(true)}
                className="bg-secondary-container text-on-secondary-container font-label-md text-sm px-4 py-2 rounded-lg font-bold hover:brightness-105 transition-all shadow-xs cursor-pointer"
              >
                File New Request
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="col-span-1 lg:col-span-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary">
                Track your RTI
              </h1>
              <p className="text-on-surface-variant text-base mt-1">
                Monitor the real-time progress of your submitted applications.
              </p>
            </div>

            {/* Quick Registration Number Lookup Search Bar */}
            <form onSubmit={handleSearchStatus} className="flex gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-72">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="text"
                  value={searchRegNo}
                  onChange={(e) => setSearchRegNo(e.target.value)}
                  placeholder="Enter Reg. Number..."
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs"
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                {isLoadingStatus ? <RotateCw className="h-4 w-4 animate-spin" /> : "Track"}
              </button>
            </form>
          </div>

          {/* Tracker Card */}
          <div className="col-span-1 lg:col-span-8">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 md:p-8 shadow-[0_4px_6px_-1px_rgba(18,53,91,0.05)] h-full flex flex-col">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-outline-variant">
                <div>
                  <span className="font-caption text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
                    Registration Number
                  </span>
                  <h2 className="text-2xl md:text-[28px] font-bold text-primary mt-1 tracking-tight">
                    {appData.application_id}
                  </h2>
                  <p className="text-on-surface-variant text-sm md:text-base mt-1">
                    {appData.authority_name}, {appData.department || "Central Secretariat"}
                  </p>
                </div>
                <div>
                  {appData.status_label.toLowerCase().includes("resolved") ? (
                    <div className="bg-tertiary-container text-on-tertiary-container font-label-md text-sm px-3.5 py-1.5 rounded-full flex items-center gap-1.5 font-bold shadow-2xs">
                      <Check className="h-4 w-4" />
                      Resolved
                    </div>
                  ) : (
                    <div className="bg-primary-container text-on-primary-container font-label-md text-sm px-3.5 py-1.5 rounded-full flex items-center gap-1.5 font-bold shadow-2xs">
                      <RotateCw className="h-4 w-4 animate-spin text-on-primary-container" />
                      {appData.status_label}
                    </div>
                  )}
                </div>
              </div>

              <h3 className="font-label-md text-base font-bold text-on-surface mb-6">
                Application Journey
              </h3>

              {/* Structural Timeline */}
              <div className="flex flex-col gap-0 mt-2 flex-grow">
                {appData.timeline && appData.timeline.length > 0 ? (
                  appData.timeline.map((event, idx) => {
                    const isLast = idx === appData.timeline.length - 1;
                    const isCompleted = event.status === "completed";
                    const isCurrent = event.status === "current";

                    return (
                      <div key={idx} className="flex gap-4 group">
                        <div className="flex flex-col items-center">
                          {isCompleted ? (
                            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm z-10">
                              <Check className="h-4 w-4 text-on-primary" strokeWidth={2.5} />
                            </div>
                          ) : isCurrent ? (
                            <div className="w-8 h-8 rounded-full bg-surface-container-lowest border-2 border-secondary-container text-secondary-container flex items-center justify-center shrink-0 shadow-sm z-10 relative">
                              <div className="w-2.5 h-2.5 bg-secondary-container rounded-full animate-ping absolute"></div>
                              <div className="w-2.5 h-2.5 bg-secondary-container rounded-full"></div>
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant text-on-surface-variant flex items-center justify-center shrink-0 z-10">
                              <div className="w-2 h-2 bg-outline rounded-full"></div>
                            </div>
                          )}

                          {!isLast && (
                            <div
                              className={`w-[2px] h-full -mt-1 mb-1 min-h-[36px] ${
                                isCompleted ? "bg-primary" : "bg-outline-variant"
                              }`}
                            ></div>
                          )}
                        </div>

                        <div className={`${isLast ? "pb-2" : "pb-6"} pt-0.5`}>
                          <p
                            className={`font-label-md text-sm md:text-[15px] font-bold ${
                              isCurrent
                                ? "text-secondary-container"
                                : isCompleted
                                ? "text-primary"
                                : "text-on-surface-variant"
                            }`}
                          >
                            {event.title}
                          </p>
                          <p className="font-caption text-xs text-on-surface-variant mt-0.5">
                            {event.date_time}
                          </p>
                          {event.description && (
                            <p
                              className={`font-body-md text-sm mt-1.5 text-on-surface ${
                                event.assigned_to
                                  ? "bg-surface-container-low p-2.5 rounded-lg border border-outline-variant inline-block text-xs md:text-sm"
                                  : ""
                              }`}
                            >
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-on-surface-variant">No timeline events recorded.</p>
                )}
              </div>
            </div>
          </div>

          {/* Contextual Sidebar */}
          <aside className="col-span-1 lg:col-span-4 flex flex-col gap-6">
            <div className="bg-surface-container-low rounded-xl p-5 border-l-4 border-secondary-container shadow-2xs">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-secondary-container mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-label-md text-sm md:text-base font-bold text-on-surface">
                    Statutory Timeline
                  </h3>
                  <p className="font-caption text-xs md:text-[13px] text-on-surface-variant mt-1 leading-relaxed">
                    As per the RTI Act, 2005, the CPIO is mandated to provide information within 30 days of receipt.
                  </p>
                  <div className="mt-3 pt-3 border-t border-outline-variant/50 flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant font-medium">Days remaining:</span>
                    <span className="font-bold text-primary bg-surface-container-lowest px-2 py-0.5 rounded border border-outline-variant">
                      {appData.days_remaining} days
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-2xs">
              <h3 className="font-label-md text-base font-bold text-on-surface mb-3">Quick Actions</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleDownloadReceipt}
                  className="w-full text-left font-body-md text-sm text-primary font-medium flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  <Download className="h-4 w-4 text-primary shrink-0" />
                  <span>Download Receipt</span>
                </button>
                {appData.can_appeal ? (
                  <Link
                    href={`/first-appeal?id=${encodeURIComponent(appData.application_id)}`}
                    className="w-full text-left font-body-md text-sm text-primary font-medium flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    <Gavel className="h-4 w-4 shrink-0" />
                    <span>File First Appeal (Section 19(1))</span>
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full text-left font-body-md text-sm flex items-center gap-3 p-3 rounded-lg text-on-surface-variant opacity-50 cursor-not-allowed"
                  >
                    <Gavel className="h-4 w-4 shrink-0" />
                    <span>File First Appeal (Available after 30 days or reply)</span>
                  </button>
                )}

                <Link
                  href="/response-analysis"
                  className="w-full text-left font-body-md text-sm text-primary font-medium flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span>Analyze Response with Copilot</span>
                </Link>
                <button
                  onClick={handlePrintForm}
                  className="w-full text-left font-body-md text-sm text-primary font-medium flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  <Printer className="h-4 w-4 text-primary shrink-0" />
                  <span>Print Status Form</span>
                </button>
              </div>
            </div>


            {/* Requested Information Summary */}
            {appData.questions && appData.questions.length > 0 && (
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-2xs">
                <h3 className="font-label-md text-sm font-bold text-on-surface mb-2">
                  Requested Information
                </h3>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-on-surface-variant">
                  {appData.questions.map((q, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {q}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </aside>
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

      {/* ========================================== */}
      {/* SCREEN 2: MY HISTORY                       */}
      {/* ========================================== */}
      <div className={`app-screen flex-grow flex flex-col ${activeScreen === "screen2" ? "active block" : "hidden"}`} id="screen2">
        {/* TopNavBar */}
        <header className="bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-40 shadow-xs">
          <div className="flex justify-between items-center px-4 md:px-8 w-full max-w-7xl mx-auto h-[64px]">
            <Link href="/" className="font-headline-md text-xl font-bold text-primary flex items-center gap-2.5">
              <Landmark className="h-6 w-6 text-primary shrink-0" />
              <span>RTI Online</span>
            </Link>
            <nav className="hidden md:flex gap-6 items-center h-full">
              <Link className="font-body-md text-on-surface-variant hover:text-primary transition-colors flex items-center h-full hover:bg-surface-container-low px-3 font-medium text-[15px]" href="/">
                Home
              </Link>
              <Link
                className="font-body-md text-on-surface-variant hover:text-primary transition-colors flex items-center h-full hover:bg-surface-container-low px-3 font-medium text-[15px]"
                href="/copilot"
              >
                {t.navCopilot}
              </Link>
              <button
                onClick={() => setIsChoiceModalOpen(true)}
                className="font-body-md text-on-surface-variant hover:text-primary transition-colors flex items-center h-full hover:bg-surface-container-low px-3 cursor-pointer font-medium text-[15px]"
              >
                File RTI
              </button>
              <button
                onClick={() => switchScreen("screen1")}
                className="font-body-md text-on-surface-variant hover:text-primary transition-colors flex items-center h-full hover:bg-surface-container-low px-3 cursor-pointer font-medium text-[15px]"
              >
                Track Status
              </button>
              {/* Active Logic Applied for Screen 2 */}
              <button
                onClick={() => switchScreen("screen2")}
                className="font-body-md text-primary font-bold border-b-2 border-secondary-container flex items-center h-full px-3 text-[15px] opacity-90 cursor-pointer"
              >
                My History
              </button>
              <Link className="font-body-md text-on-surface-variant hover:text-primary transition-colors flex items-center h-full hover:bg-surface-container-low px-3 font-medium text-[15px]" href="/faq">
                FAQ
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <LanguageSelector />
              {isSignedIn ? (
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9",
                    },
                  }}
                />
              ) : (
                <SignInButton mode="modal">
                  <button className="hidden md:block font-label-md text-sm text-on-surface-variant hover:text-primary px-3 py-1.5 transition-colors font-semibold cursor-pointer">
                    Login / Register
                  </button>
                </SignInButton>
              )}
              <button
                onClick={() => setIsChoiceModalOpen(true)}
                className="bg-secondary-container text-on-secondary-container font-label-md text-sm px-4 py-2 rounded-lg font-bold hover:brightness-105 transition-all shadow-xs cursor-pointer"
              >
                File New Request
              </button>
            </div>
          </div>
        </header>

        <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary">
                RTI History
              </h1>
              <p className="text-on-surface-variant text-base mt-1">
                A comprehensive log of all your applications and appeals.
              </p>
            </div>
            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="flex bg-surface-container-low rounded-lg p-1 border border-outline-variant">
                <button
                  onClick={() => setHistoryFilter("all")}
                  className={`px-4 py-1.5 rounded text-sm font-semibold transition-all cursor-pointer ${
                    historyFilter === "all"
                      ? "bg-surface-container-lowest text-primary shadow-xs"
                      : "text-on-surface-variant hover:bg-surface-container-lowest"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setHistoryFilter("active")}
                  className={`px-4 py-1.5 rounded text-sm font-semibold transition-all cursor-pointer ${
                    historyFilter === "active"
                      ? "bg-surface-container-lowest text-primary shadow-xs"
                      : "text-on-surface-variant hover:bg-surface-container-lowest"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setHistoryFilter("completed")}
                  className={`px-4 py-1.5 rounded text-sm font-semibold transition-all cursor-pointer ${
                    historyFilter === "completed"
                      ? "bg-surface-container-lowest text-primary shadow-xs"
                      : "text-on-surface-variant hover:bg-surface-container-lowest"
                  }`}
                >
                  Completed
                </button>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Search Registration No..."
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs transition-all"
                />
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-x-auto shadow-[0_4px_6px_-1px_rgba(18,53,91,0.05)]">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="py-3.5 px-5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Registration Number
                  </th>
                  <th className="py-3.5 px-5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Public Authority
                  </th>
                  <th className="py-3.5 px-5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Submission Date
                  </th>
                  <th className="py-3.5 px-5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Type
                  </th>
                  <th className="py-3.5 px-5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3.5 px-5 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((item) => {
                    const isResolved = item.status.toLowerCase().includes("resolved");
                    return (
                      <tr key={item.application_id} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-4 px-5 text-sm font-bold text-primary font-mono">
                          {item.application_id}
                        </td>
                        <td className="py-4 px-5 text-sm text-on-surface">
                          {item.authority_name}
                        </td>
                        <td className="py-4 px-5 text-sm text-on-surface-variant">
                          {item.submitted_date}
                        </td>
                        <td className="py-4 px-5 text-sm text-on-surface font-medium">
                          {item.type}
                        </td>
                        <td className="py-4 px-5">
                          {isResolved ? (
                            <span className="inline-flex items-center gap-1.5 bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shadow-2xs">
                              <Check className="h-3 w-3" strokeWidth={2.5} /> Resolved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-on-primary-container animate-pulse"></span>
                              Under Process
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <Link
                              href={`/response-analysis?id=${encodeURIComponent(item.application_id)}`}
                              className="font-label-md text-xs text-primary font-bold hover:underline cursor-pointer flex items-center gap-1 bg-surface-container-low hover:bg-surface-container px-2.5 py-1.5 rounded-lg border border-outline-variant transition-colors"
                            >
                              <Sparkles className="h-3.5 w-3.5 text-primary" />
                              <span>Analyze Response</span>
                            </Link>
                            <button
                              onClick={() => handleViewDetails(item.application_id)}
                              className="font-label-md text-sm text-primary font-bold hover:underline cursor-pointer flex items-center gap-1"
                            >
                              <span>Track</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-on-surface-variant">
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination (Structural) */}
            <div className="px-5 py-3 border-t border-outline-variant flex justify-between items-center bg-surface-container-lowest">
              <span className="font-caption text-xs text-on-surface-variant font-medium">
                Showing 1 to {filteredHistory.length} of 12 entries
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer"
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(1)}
                  className={`w-8 h-8 rounded text-xs font-bold flex items-center justify-center transition-colors ${
                    currentPage === 1
                      ? "bg-primary text-on-primary"
                      : "border border-outline-variant text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  1
                </button>
                <button
                  onClick={() => setCurrentPage(2)}
                  className={`w-8 h-8 rounded text-xs font-bold flex items-center justify-center transition-colors ${
                    currentPage === 2
                      ? "bg-primary text-on-primary"
                      : "border border-outline-variant text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  2
                </button>
                <button
                  onClick={() => setCurrentPage(3)}
                  className={`w-8 h-8 rounded text-xs font-bold flex items-center justify-center transition-colors ${
                    currentPage === 3
                      ? "bg-primary text-on-primary"
                      : "border border-outline-variant text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  3
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
                  className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                  disabled={currentPage === 3}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
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

      {/* File RTI Choice Modal */}
      <FileRtiChoiceModal
        isOpen={isChoiceModalOpen}
        onClose={() => setIsChoiceModalOpen(false)}
        onSelectCopilot={() => {
          setIsChoiceModalOpen(false);
          router.push("/copilot");
        }}

        onSelectManual={() => {
          setIsChoiceModalOpen(false);
          router.push("/file-rti");
        }}
      />

    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading Track Status...</div>}>
      <TrackAndHistoryContent />
    </Suspense>
  );
}
