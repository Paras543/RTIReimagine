"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";
import {
  Menu,
  X,
  Bot,
  Sparkles,
  FileText,
  Search,
  History,
  Gavel,
  HelpCircle,
  Home,
  User,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { LanguageSelector } from "@/components/language-selector";

interface SiteHeaderProps {
  activeTab?:
    | "home"
    | "copilot"
    | "file-rti"
    | "track"
    | "first-appeal"
    | "history"
    | "faq"
    | "response-analysis";
  onOpenFileChoiceModal?: () => void;
  variant?: "full" | "compact";
}

export function SiteHeader({
  activeTab,
  onOpenFileChoiceModal,
  variant = "full",
}: SiteHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Determine current active route if not explicitly passed
  const currentTab =
    activeTab ||
    (pathname === "/"
      ? "home"
      : pathname.startsWith("/copilot")
      ? "copilot"
      : pathname.startsWith("/file-rti")
      ? "file-rti"
      : pathname.startsWith("/track")
      ? "track"
      : pathname.startsWith("/first-appeal")
      ? "first-appeal"
      : pathname.startsWith("/history")
      ? "history"
      : pathname.startsWith("/faq")
      ? "faq"
      : pathname.startsWith("/response-analysis")
      ? "response-analysis"
      : "home");

  const handleFileRtiClick = () => {
    setMobileMenuOpen(false);
    if (onOpenFileChoiceModal) {
      onOpenFileChoiceModal();
    } else {
      router.push("/file-rti");
    }
  };

  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-surface-container-high py-1 px-4 sm:px-6 md:px-8 w-full border-b border-outline-variant text-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-on-surface-variant font-medium">
          <div className="flex items-center gap-2 flex-wrap">
            <img
              className="h-4 w-4 object-contain shrink-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9CEDKjhx9PkfRYl6NYdCt_XnxAHtU9M9rZhXre46VzsXyUMLtJPdI8KN5YcBiYXrUFW4mlgzGt-1lSXAgNjCnoFkSWgjG2LT2FvTXewx201vGgO6lHdtV34nRCotr3j7t5JjqMeAOlbapZk5hiY9FzH29xV14tvcddk4DcxJtMHhQIJOBSHcUnAkuoEK1USbK4Pmq1V4oEzEhDPefdkEOY4GMiyocIXPbXGZbcR4wuulJ2CpT-Lvq"
              alt="Emblem"
            />
            <span className="hidden sm:inline">{t.govOfIndia}</span>
            <span className="sm:hidden text-[11px] font-semibold">{t.govOfIndia}</span>
            <span className="w-[1px] h-3 bg-outline-variant mx-1 hidden sm:inline-block"></span>
            <div className="flex items-center gap-1.5">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg"
                className="h-3 w-auto object-contain shrink-0"
                alt="Indian Flag"
              />
              <span className="text-[10px] uppercase tracking-wider font-bold opacity-75 hidden sm:inline">
                {t.madeInIndia}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <a
              className="hidden md:inline-block hover:text-primary transition-colors text-[11.5px]"
              href="#main-content"
            >
              {t.skipToMain}
            </a>
            <span className="hidden md:inline-block w-[1px] h-3 bg-outline-variant"></span>
            {/* Language Selector */}
            <LanguageSelector />
          </div>
        </div>
      </div>

      {/* Main Header with Official Emblem and Viksit India Logo */}
      <header className="bg-surface-container-lowest border-b border-outline-variant py-2.5 sm:py-3.5 px-4 sm:px-6 md:px-8 w-full transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          {/* Left: National Emblem & Portal Title */}
          <Link href="/" className="flex items-center gap-3 sm:gap-4 group focus-visible:outline-none">
            <img
              className="h-12 sm:h-16 w-auto object-contain shrink-0 transition-transform group-hover:scale-[1.02]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKNgfcj8pGfbImVV9qFRR7dMonANec5PBYViLmUSvnISJaOa80b8OGK-gSkAKIFUnepxJx3wZvwL9YLS8TgOhIrTsu85fmikN_ITgaLprlLfyMYA8cEyu9S4U_Swo7UqGznE3DroPRfTPKtMgRoNXBK8CXKQAFqGBhVddbYnGDhXHdV134e_-2LuIhA886-SaFZH931WR1KHMEvy0VtXOuRxnuysHSANc-uS3-YEflsXOVhkVGMPHn"
              alt="Emblem of India"
            />
            <div className="flex flex-col">
              <span className="text-[18px] sm:text-[22px] md:text-[26px] font-extrabold text-primary leading-tight tracking-tight">
                {t.portalTitle}
              </span>
              <span className="text-[11px] sm:text-xs text-on-surface-variant font-medium leading-tight mt-0.5 line-clamp-1">
                {t.portalSubtitle}
              </span>
            </div>
          </Link>

          {/* Right: Viksit India Logo & Mobile Hamburger Menu */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Official Viksit India Logo */}
            <div className="flex items-center">
              <img
                src="/viksit-india.png"
                alt="Viksit India - Bold Vision. Brighter Future"
                className="h-11 sm:h-14 md:h-16 w-auto object-contain rounded-sm"
              />
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="md:hidden p-2 rounded-lg text-on-surface hover:text-primary hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-primary" />
              ) : (
                <Menu className="h-6 w-6 text-primary" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Desktop Sticky Navigation Bar */}
      <nav className="bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-30 shadow-xs hidden md:block">
        <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 w-full max-w-7xl mx-auto h-14">
          {/* Navigation Links */}
          <div className="flex items-center gap-1 lg:gap-2 h-full">
            <Link
              id="nav-home"
              href="/"
              className={`h-full flex items-center px-3.5 text-sm font-semibold transition-colors border-b-2 ${
                currentTab === "home"
                  ? "text-primary border-secondary-container bg-surface-container-low/50"
                  : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low border-transparent"
              }`}
            >
              {t.navHome}
            </Link>

            {/* RTI Copilot */}
            {isSignedIn ? (
              <Link
                id="nav-copilot"
                href="/copilot"
                className={`h-full flex items-center gap-1.5 px-3.5 text-sm font-semibold transition-colors border-b-2 ${
                  currentTab === "copilot"
                    ? "text-primary border-secondary-container bg-surface-container-low/50"
                    : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low border-transparent"
                }`}
              >
                <Bot className="h-4 w-4 text-primary" />
                <span>{t.navCopilot}</span>
                <span className="text-[10px] bg-[#fff3ea] text-[#c2410c] px-1.5 py-0.2 rounded-full font-bold border border-[#ffddc2]">
                  AI
                </span>
              </Link>
            ) : (
              <SignInButton mode="modal">
                <button
                  id="nav-copilot"
                  className={`h-full flex items-center gap-1.5 px-3.5 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
                    currentTab === "copilot"
                      ? "text-primary border-secondary-container bg-surface-container-low/50"
                      : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low border-transparent"
                  }`}
                >
                  <Bot className="h-4 w-4 text-primary" />
                  <span>{t.navCopilot}</span>
                  <span className="text-[10px] bg-[#fff3ea] text-[#c2410c] px-1.5 py-0.2 rounded-full font-bold border border-[#ffddc2]">
                    AI
                  </span>
                </button>
              </SignInButton>
            )}

            {/* File RTI */}
            <button
              id="nav-file-rti"
              onClick={handleFileRtiClick}
              className={`h-full flex items-center px-3.5 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
                currentTab === "file-rti"
                  ? "text-primary border-secondary-container bg-surface-container-low/50"
                  : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low border-transparent"
              }`}
            >
              {t.navFileRti}
            </button>

            {/* Track Status */}
            {isSignedIn ? (
              <Link
                id="nav-track-status"
                href="/track"
                className={`h-full flex items-center px-3.5 text-sm font-semibold transition-colors border-b-2 ${
                  currentTab === "track"
                    ? "text-primary border-secondary-container bg-surface-container-low/50"
                    : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low border-transparent"
                }`}
              >
                {t.navTrackStatus}
              </Link>
            ) : (
              <SignInButton mode="modal">
                <button
                  id="nav-track-status"
                  className={`h-full flex items-center px-3.5 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
                    currentTab === "track"
                      ? "text-primary border-secondary-container bg-surface-container-low/50"
                      : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low border-transparent"
                  }`}
                >
                  {t.navTrackStatus}
                </button>
              </SignInButton>
            )}

            {/* First Appeal */}
            {isSignedIn ? (
              <Link
                id="nav-first-appeal"
                href="/first-appeal"
                className={`h-full flex items-center px-3.5 text-sm font-semibold transition-colors border-b-2 ${
                  currentTab === "first-appeal"
                    ? "text-primary border-secondary-container bg-surface-container-low/50"
                    : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low border-transparent"
                }`}
              >
                {t.navFirstAppeal || "First Appeal"}
              </Link>
            ) : (
              <SignInButton mode="modal">
                <button
                  id="nav-first-appeal"
                  className={`h-full flex items-center px-3.5 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
                    currentTab === "first-appeal"
                      ? "text-primary border-secondary-container bg-surface-container-low/50"
                      : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low border-transparent"
                  }`}
                >
                  {t.navFirstAppeal || "First Appeal"}
                </button>
              </SignInButton>
            )}

            {/* My History */}
            {isSignedIn ? (
              <Link
                id="nav-my-history"
                href="/history"
                className={`h-full flex items-center px-3.5 text-sm font-semibold transition-colors border-b-2 ${
                  currentTab === "history"
                    ? "text-primary border-secondary-container bg-surface-container-low/50"
                    : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low border-transparent"
                }`}
              >
                {t.navMyHistory}
              </Link>
            ) : (
              <SignInButton mode="modal">
                <button
                  id="nav-my-history"
                  className={`h-full flex items-center px-3.5 text-sm font-semibold transition-colors border-b-2 cursor-pointer ${
                    currentTab === "history"
                      ? "text-primary border-secondary-container bg-surface-container-low/50"
                      : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low border-transparent"
                  }`}
                >
                  {t.navMyHistory}
                </button>
              </SignInButton>
            )}

            {/* FAQ */}
            <Link
              id="nav-faq"
              href="/faq"
              className={`h-full flex items-center px-3.5 text-sm font-semibold transition-colors border-b-2 ${
                currentTab === "faq"
                  ? "text-primary border-secondary-container bg-surface-container-low/50"
                  : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low border-transparent"
              }`}
            >
              {t.navFaq}
            </Link>
          </div>

          {/* Desktop Right CTA and Profile */}
          <div className="flex items-center gap-3 h-full shrink-0">
            {isSignedIn ? (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9 border border-outline-variant",
                  },
                }}
              />
            ) : (
              <SignInButton mode="modal">
                <button
                  id="nav-login-btn"
                  className="text-sm text-primary hover:text-primary-container px-3 py-1.5 rounded-md hover:bg-surface-container-low transition-colors font-semibold cursor-pointer"
                >
                  {t.loginRegister}
                </button>
              </SignInButton>
            )}
            <button
              id="nav-file-request-btn"
              onClick={handleFileRtiClick}
              className="bg-secondary-container text-on-secondary-container text-sm px-4 py-2 rounded-lg font-bold hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
            >
              {t.heroCtaFileNow}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-Out Drawer / Navigation Sheet */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-surface-container-lowest h-full shadow-2xl z-20 flex flex-col justify-between overflow-y-auto border-l border-outline-variant">
            {/* Drawer Header */}
            <div className="p-5 border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  className="h-10 w-auto object-contain"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKNgfcj8pGfbImVV9qFRR7dMonANec5PBYViLmUSvnISJaOa80b8OGK-gSkAKIFUnepxJx3wZvwL9YLS8TgOhIrTsu85fmikN_ITgaLprlLfyMYA8cEyu9S4U_Swo7UqGznE3DroPRfTPKtMgRoNXBK8CXKQAFqGBhVddbYnGDhXHdV134e_-2LuIhA886-SaFZH931WR1KHMEvy0VtXOuRxnuysHSANc-uS3-YEflsXOVhkVGMPHn"
                  alt="Emblem"
                />
                <div>
                  <h2 className="text-base font-bold text-primary leading-tight">{t.portalTitle}</h2>
                  <p className="text-[11px] text-on-surface-variant">{t.govOfIndia}</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Viksit India Banner in Drawer */}
            <div className="px-5 py-3 bg-gradient-to-r from-orange-50/70 via-white to-green-50/70 border-b border-outline-variant flex items-center justify-between">
              <img
                src="/viksit-india.png"
                alt="Viksit India Logo"
                className="h-10 w-auto object-contain"
              />
              <span className="text-[11px] font-bold text-primary tracking-wide">
                VIKSIT BHARAT 2047
              </span>
            </div>

            {/* Navigation Links */}
            <div className="flex-grow p-4 flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-semibold transition-colors ${
                  currentTab === "home"
                    ? "bg-primary text-on-primary"
                    : "text-on-surface hover:bg-surface-container-low"
                }`}
              >
                <Home className="h-4 w-4" />
                <span>{t.navHome}</span>
              </Link>

              {/* Copilot Link */}
              {isSignedIn ? (
                <Link
                  href="/copilot"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-semibold transition-colors ${
                    currentTab === "copilot"
                      ? "bg-primary text-on-primary"
                      : "text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Bot className="h-4 w-4 text-orange-500" />
                    <span>{t.navCopilot}</span>
                  </div>
                  <span className="text-[10px] bg-[#fff3ea] text-[#c2410c] px-1.5 py-0.5 rounded-full font-bold border border-[#ffddc2]">
                    AI Assist
                  </span>
                </Link>
              ) : (
                <SignInButton mode="modal">
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Bot className="h-4 w-4 text-orange-500" />
                      <span>{t.navCopilot}</span>
                    </div>
                    <span className="text-[10px] bg-[#fff3ea] text-[#c2410c] px-1.5 py-0.5 rounded-full font-bold border border-[#ffddc2]">
                      AI Assist
                    </span>
                  </button>
                </SignInButton>
              )}

              {/* File RTI */}
              <button
                onClick={handleFileRtiClick}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-semibold transition-colors text-left cursor-pointer ${
                  currentTab === "file-rti"
                    ? "bg-primary text-on-primary"
                    : "text-on-surface hover:bg-surface-container-low"
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>{t.navFileRti}</span>
              </button>

              {/* Track Status */}
              {isSignedIn ? (
                <Link
                  href="/track"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-semibold transition-colors ${
                    currentTab === "track"
                      ? "bg-primary text-on-primary"
                      : "text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  <Search className="h-4 w-4" />
                  <span>{t.navTrackStatus}</span>
                </Link>
              ) : (
                <SignInButton mode="modal">
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    <Search className="h-4 w-4" />
                    <span>{t.navTrackStatus}</span>
                  </button>
                </SignInButton>
              )}

              {/* First Appeal */}
              {isSignedIn ? (
                <Link
                  href="/first-appeal"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-semibold transition-colors ${
                    currentTab === "first-appeal"
                      ? "bg-primary text-on-primary"
                      : "text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  <Gavel className="h-4 w-4" />
                  <span>{t.navFirstAppeal || "First Appeal"}</span>
                </Link>
              ) : (
                <SignInButton mode="modal">
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    <Gavel className="h-4 w-4" />
                    <span>{t.navFirstAppeal || "First Appeal"}</span>
                  </button>
                </SignInButton>
              )}

              {/* My History */}
              {isSignedIn ? (
                <Link
                  href="/history"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-semibold transition-colors ${
                    currentTab === "history"
                      ? "bg-primary text-on-primary"
                      : "text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  <History className="h-4 w-4" />
                  <span>{t.navMyHistory}</span>
                </Link>
              ) : (
                <SignInButton mode="modal">
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    <History className="h-4 w-4" />
                    <span>{t.navMyHistory}</span>
                  </button>
                </SignInButton>
              )}

              {/* FAQ */}
              <Link
                href="/faq"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-semibold transition-colors ${
                  currentTab === "faq"
                    ? "bg-primary text-on-primary"
                    : "text-on-surface hover:bg-surface-container-low"
                }`}
              >
                <HelpCircle className="h-4 w-4" />
                <span>{t.navFaq}</span>
              </Link>
            </div>

            {/* Mobile Footer & Auth */}
            <div className="p-4 border-t border-outline-variant bg-surface-container-low flex flex-col gap-3">
              {isSignedIn ? (
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest border border-outline-variant">
                  <div className="flex items-center gap-2">
                    <UserButton />
                    <span className="text-xs font-semibold text-primary">Citizen Account</span>
                  </div>
                  <Link
                    href="/track?screen=screen2"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs text-secondary font-bold hover:underline"
                  >
                    My Requests
                  </Link>
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 rounded-lg border border-primary text-primary font-semibold text-sm hover:bg-primary/5 transition-colors cursor-pointer text-center"
                  >
                    {t.loginRegister}
                  </button>
                </SignInButton>
              )}

              <button
                onClick={handleFileRtiClick}
                className="w-full py-3 px-4 rounded-lg bg-secondary-container text-on-secondary-container font-bold text-sm hover:brightness-105 transition-all text-center shadow-xs cursor-pointer"
              >
                {t.heroCtaFileNow}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
