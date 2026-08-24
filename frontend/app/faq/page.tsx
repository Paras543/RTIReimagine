"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";
import {
  Search,
  ChevronDown,
  Headset,
  Phone,
  Mail,
  FileText,
  CreditCard,
  Clock,
  Menu,
} from "lucide-react";
import { FileRtiChoiceModal } from "@/components/file-rti-choice-modal";

interface FaqItem {
  id: string;
  category: "General" | "Filing" | "Fees" | "Status" | "Appeals";
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: "auth-1",
    category: "General",
    question: "Which authorities can be approached under RTI?",
    answer:
      "You can file an RTI request with any 'Public Authority', which includes all Central Government Ministries, Departments, and allied public sector undertakings. State government departments must be approached via their respective state portals.",
  },
  {
    id: "fees-1",
    category: "Fees",
    question: "How is the RTI fee paid online?",
    answer:
      "The initial application fee of ₹10 can be paid via Internet Banking of State Bank of India and its associate banks, or using any Credit/Debit Card (Visa/MasterCard/RuPay) or UPI via the integrated SBI payment gateway.",
  },
  {
    id: "filing-1",
    category: "Filing",
    question: "What happens if I don't receive a response within 30 days?",
    answer:
      "If you do not receive a response within the mandated 30 days, or are unsatisfied with the response, you have the statutory right to file a First Appeal within the RTI Online portal to the designated First Appellate Authority (FAA) of that department.",
  },
  {
    id: "general-2",
    category: "General",
    question: "Who can file an RTI application?",
    answer:
      "Any citizen of India can file an RTI application to seek information from public authorities under Section 3 of the Right to Information Act, 2005. Non-citizens are not entitled to file RTI applications under the Act.",
  },
  {
    id: "fees-2",
    category: "Fees",
    question: "Are BPL (Below Poverty Line) citizens exempt from paying application fees?",
    answer:
      "Yes, citizens belonging to the Below Poverty Line (BPL) category are exempt from paying the application fee of ₹10 as well as any additional photocopying or inspection charges. A valid BPL card or certificate must be uploaded during submission.",
  },
  {
    id: "status-1",
    category: "Status",
    question: "How can I check the status of my filed RTI application?",
    answer:
      "You can check your status at any time by clicking 'Track Status' in the navigation bar and entering your 14-digit Registration Number and registered Email ID/Mobile Number. You will see real-time updates and download official replies.",
  },
  {
    id: "appeals-1",
    category: "Appeals",
    question: "What is the time limit for filing a First Appeal?",
    answer:
      "A First Appeal must be filed within 30 days from the expiry of the prescribed response period (30 days from filing) or within 30 days from the date on which the decision of the Public Information Officer (CPIO) was received.",
  },
  {
    id: "filing-2",
    category: "Filing",
    question: "Can I file RTI for multiple questions or issues in a single request?",
    answer:
      "Yes, you can ask multiple specific and clear questions regarding a single subject matter in one application. However, as per Department of Personnel & Training guidelines, an RTI application should ideally not exceed 500 words and should be confined to a single subject.",
  },
];

const CATEGORIES = ["All", "General", "Filing", "Fees", "Status", "Appeals"] as const;

export default function FaqPage() {
  const { isSignedIn } = useAuth();
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openAccordionId, setOpenAccordionId] = useState<string | null>("auth-1");

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id: string) => {
    setOpenAccordionId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      {/* TopNavBar */}
      <nav className="bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-30 shadow-xs">
        <div className="flex justify-between items-center px-4 md:px-8 w-full max-w-7xl mx-auto h-16 overflow-x-auto no-scrollbar">
          {/* Brand + Navigation Links */}
          <div className="flex items-center gap-8 h-full min-w-max">
            <Link href="/" className="flex items-center gap-3">
              <img
                className="h-10 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKNgfcj8pGfbImVV9qFRR7dMonANec5PBYViLmUSvnISJaOa80b8OGK-gSkAKIFUnepxJx3wZvwL9YLS8TgOhIrTsu85fmikN_ITgaLprlLfyMYA8cEyu9S4U_Swo7UqGznE3DroPRfTPKtMgRoNXBK8CXKQAFqGBhVddbYnGDhXHdV134e_-2LuIhA886-SaFZH931WR1KHMEvy0VtXOuRxnuysHSANc-uS3-YEflsXOVhkVGMPHn"
                alt="Emblem of India"
              />
              <span className="font-headline-md text-xl font-bold text-primary tracking-tight">
                RTI Online
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6 h-full">
              <Link
                className="text-on-surface-variant hover:text-primary h-full flex items-center hover:bg-surface-container-low transition-colors px-3 font-medium text-[15px]"
                href="/"
              >
                Home
              </Link>

              {/* File RTI */}
              <button
                onClick={() => setIsChoiceModalOpen(true)}
                className="text-on-surface-variant hover:text-primary h-full flex items-center hover:bg-surface-container-low transition-colors px-3 cursor-pointer font-medium text-[15px]"
              >
                File RTI
              </button>

              {/* Track Status */}
              <Link
                className="text-on-surface-variant hover:text-primary h-full flex items-center hover:bg-surface-container-low transition-colors px-3 font-medium text-[15px]"
                href="/"
              >
                Track Status
              </Link>

              {/* My History */}
              <Link
                className="text-on-surface-variant hover:text-primary h-full flex items-center hover:bg-surface-container-low transition-colors px-3 font-medium text-[15px]"
                href="/"
              >
                My History
              </Link>

              {/* FAQ - Active */}
              <Link
                className="text-primary font-bold border-b-2 border-secondary-container pb-1 h-full flex items-center hover:bg-surface-container-low transition-colors px-3 text-[15px]"
                href="/faq"
              >
                FAQ
              </Link>
            </div>
          </div>

          {/* Trailing Actions */}
          <div className="flex items-center gap-3 h-full shrink-0">
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
                <button className="hidden md:block bg-surface text-primary border border-outline-variant px-4 py-2 rounded-lg hover:bg-surface-container-low transition-colors font-semibold text-sm">
                  Login / Register
                </button>
              </SignInButton>
            )}
            <button
              onClick={() => setIsChoiceModalOpen(true)}
              className="bg-secondary-container text-on-secondary-container px-5 py-2.5 rounded-lg font-bold hover:brightness-110 transition-all cursor-pointer shadow-xs text-sm"
            >
              File New Request
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-10 lg:py-14" id="faq-main">
        {/* Header Section */}
        <header className="mb-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-[42px] text-primary font-bold tracking-tight mb-3">
            FAQ &amp; Support Center
          </h1>
          <p className="text-base md:text-[17px] text-on-surface-variant max-w-2xl leading-relaxed">
            Find answers to common questions about the Right to Information process, or contact our support team for technical assistance.
          </p>
        </header>

        {/* Search Bar */}
        <section className="mb-10">
          <div className="relative w-full max-w-2xl">
            <Search className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers (e.g., 'Payment issues', 'Status pending')..."
              className="w-full pl-12 pr-12 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none font-body-md text-base shadow-xs transition-all placeholder:text-on-surface-variant/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-on-surface-variant hover:text-primary"
              >
                Clear
              </button>
            )}
          </div>
        </section>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: FAQ Section */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div>
              <h2 className="font-headline-md text-2xl text-primary font-bold mb-4">
                Frequently Asked Questions
              </h2>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full font-label-md text-sm font-semibold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-primary text-on-primary shadow-xs"
                        : "bg-surface-container border border-outline-variant text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Accordion FAQ List */}
              <div className="flex flex-col gap-3">
                {filteredFaqs.length > 0 ? (
                  filteredFaqs.map((faq) => {
                    const isOpen = openAccordionId === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className={`bg-surface-container-lowest border rounded-xl overflow-hidden shadow-2xs transition-all ${
                          isOpen
                            ? "border-primary/60 ring-1 ring-primary/20"
                            : "border-outline-variant/80 hover:border-outline"
                        }`}
                      >
                        <button
                          onClick={() => toggleAccordion(faq.id)}
                          className="w-full flex justify-between items-center p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer transition-colors"
                        >
                          <span className="font-headline-md text-base md:text-[17px] font-semibold text-primary pr-4">
                            {faq.question}
                          </span>
                          <ChevronDown
                            className={`h-5 w-5 text-primary shrink-0 transition-transform duration-300 ${
                              isOpen ? "rotate-180 text-secondary-container" : ""
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 text-on-surface-variant font-body-md text-[15px] leading-relaxed border-t border-outline-variant/40 bg-surface-container-lowest">
                            <p>{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-surface-container-low rounded-xl p-8 text-center text-on-surface-variant">
                    <p className="font-semibold text-base mb-1">No matching questions found</p>
                    <p className="text-sm">Try searching for other terms or reset the category filter.</p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("All");
                      }}
                      className="mt-3 text-primary font-bold text-sm hover:underline cursor-pointer"
                    >
                      Reset filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Support Center Sidebar */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-xs">
              <h2 className="font-headline-md text-xl text-primary font-bold mb-2">
                Support Center
              </h2>
              <p className="font-body-md text-sm text-on-surface-variant mb-6 leading-relaxed">
                Need direct assistance? Our official help desk is available during working hours.
              </p>

              {/* Official Help Desk Card */}
              <div className="bg-surface-container-low border-l-4 border-primary p-5 rounded-xl flex flex-col gap-4">
                <div className="flex items-center gap-2.5 text-primary">
                  <Headset className="h-5 w-5 text-primary" />
                  <h3 className="font-label-md text-base font-bold text-primary">
                    Official Help Desk
                  </h3>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-on-surface-variant mt-1 shrink-0" />
                  <div>
                    <p className="font-body-md text-base font-bold text-on-surface">
                      011-24010690
                    </p>
                    <p className="font-caption text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" /> Mon-Fri, 9:00 AM - 5:30 PM
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1 border-t border-outline-variant/40">
                  <Mail className="h-4 w-4 text-on-surface-variant shrink-0" />
                  <a
                    className="font-body-md text-sm text-primary hover:underline font-semibold break-all"
                    href="mailto:helprtionline-dopt@nic.in"
                  >
                    helprtionline-dopt@nic.in
                  </a>
                </div>
              </div>

              {/* Contextual Guidance Cards */}
              <div className="grid grid-cols-1 gap-3 mt-6">
                <div
                  onClick={() => setIsChoiceModalOpen(true)}
                  className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl hover:border-primary cursor-pointer transition-all hover:shadow-xs group"
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <FileText className="h-4 w-4 text-secondary-container" />
                    <h4 className="font-label-md text-sm font-bold text-primary group-hover:text-secondary-container transition-colors">
                      Filing Guidance
                    </h4>
                  </div>
                  <p className="font-caption text-xs text-on-surface-variant leading-relaxed">
                    Step-by-step instructions on drafting your application.
                  </p>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl hover:border-primary cursor-pointer transition-all hover:shadow-xs group">
                  <div className="flex items-center gap-2.5 mb-1">
                    <CreditCard className="h-4 w-4 text-error" />
                    <h4 className="font-label-md text-sm font-bold text-primary group-hover:text-error transition-colors">
                      Payment Issues
                    </h4>
                  </div>
                  <p className="font-caption text-xs text-on-surface-variant leading-relaxed">
                    Resolve failed transactions or receipt download errors.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-on-primary w-full py-8 px-4 md:px-8 mt-auto border-t border-primary-container">
        <div className="w-full flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-6 md:gap-0">
          <div className="text-xs font-bold text-on-primary">
            © 2024 RTI Online. Designed and Developed by National Informatics Centre (NIC).
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-6 text-xs">
            <a className="text-on-primary opacity-80 hover:opacity-100 hover:text-secondary-fixed transition-opacity cursor-pointer" href="#">
              Privacy Policy
            </a>
            <a className="text-on-primary opacity-80 hover:opacity-100 hover:text-secondary-fixed transition-opacity cursor-pointer" href="#">
              Terms of Service
            </a>
            <a className="text-on-primary opacity-80 hover:opacity-100 hover:text-secondary-fixed transition-opacity cursor-pointer" href="#">
              Contact Us
            </a>
            <Link className="text-on-primary opacity-80 hover:opacity-100 hover:text-secondary-fixed transition-opacity font-semibold cursor-pointer" href="/faq">
              Help Desk
            </Link>
            <a className="text-on-primary opacity-80 hover:opacity-100 hover:text-secondary-fixed transition-opacity cursor-pointer" href="#">
              Accessibility Statement
            </a>
          </div>
        </div>
      </footer>

      {/* File RTI Choice Modal */}
      <FileRtiChoiceModal
        isOpen={isChoiceModalOpen}
        onClose={() => setIsChoiceModalOpen(false)}
        onSelectCopilot={() => {
          setIsChoiceModalOpen(false);
        }}
        onSelectManual={() => {
          setIsChoiceModalOpen(false);
        }}
      />
    </div>
  );
}
