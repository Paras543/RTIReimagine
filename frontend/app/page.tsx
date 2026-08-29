"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Search,
  Gavel,
  FileSearch,
  History,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Bot,
  Sparkles,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { FileRtiChoiceModal } from "@/components/file-rti-choice-modal";
import { useLanguage } from "@/lib/language-context";

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { t } = useLanguage();
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);

  return (
    <>
      {/* Unified Site Header with Viksit India Logo & Responsive Mobile Menu */}
      <SiteHeader
        activeTab="home"
        onOpenFileChoiceModal={() => setIsChoiceModalOpen(true)}
      />

      {/* Main Content Canvas */}
      <main className="flex-grow flex flex-col w-full" id="main-content">
        {/* Hero Section */}
        <section className="relative w-full bg-surface-container py-12 md:py-16 lg:py-24 overflow-hidden bg-pattern-gov px-4 sm:px-6 md:px-8">
          <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="md:col-span-7 flex flex-col gap-5 md:gap-6 z-20">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="h-5 w-5 text-secondary-container" />
                <span className="font-label-md text-xs sm:text-sm text-on-surface-variant font-bold uppercase tracking-widest">
                  {t.heroBadge}
                </span>
              </div>

              <h2 className="font-display-lg text-[30px] sm:text-[38px] lg:text-[50px] text-primary font-bold leading-[1.15] max-w-2xl tracking-tight">
                {t.heroTitle1}
                <br />
                <span className="text-secondary-container">{t.heroTitle2}</span>
              </h2>

              <p className="font-body-lg text-[15px] sm:text-[16px] lg:text-[17.5px] text-on-surface-variant max-w-[540px] leading-relaxed">
                {t.heroSubtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2">
                <Button
                  id="hero-file-rti-btn"
                  onClick={() => setIsChoiceModalOpen(true)}
                  className="bg-primary text-on-primary font-label-md text-sm sm:text-base font-semibold px-6 h-12 rounded-lg hover:bg-primary-container transition-colors flex justify-center items-center gap-2 cursor-pointer shadow-xs"
                >
                  <FileText className="h-5 w-5" />
                  {t.heroCtaFileNow}
                </Button>

                {isSignedIn ? (
                  <Button
                    variant="outline"
                    onClick={() => router.push("/copilot")}
                    className="bg-surface-container-lowest border-2 border-primary/30 text-primary hover:border-primary font-label-md text-sm sm:text-base font-bold px-6 h-12 rounded-lg hover:bg-surface-container-low transition-all flex justify-center items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Sparkles className="h-4 w-4 text-[#ea580c]" />
                    {t.heroCtaCopilot}
                  </Button>
                ) : (
                  <SignInButton mode="modal">
                    <Button
                      variant="outline"
                      className="bg-surface-container-lowest border-2 border-primary/30 text-primary hover:border-primary font-label-md text-sm sm:text-base font-bold px-6 h-12 rounded-lg hover:bg-surface-container-low transition-all flex justify-center items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Sparkles className="h-4 w-4 text-[#ea580c]" />
                      {t.heroCtaCopilot}
                    </Button>
                  </SignInButton>
                )}
              </div>
            </div>

            <div className="md:col-span-5 flex justify-center md:justify-end relative z-20">
              <div className="w-full max-w-[420px] bg-surface-container-lowest border border-outline-variant rounded-xl p-6 sm:p-8 shadow-sm">
                <h3 className="font-headline-md text-xl sm:text-[22px] text-primary font-bold mb-4">
                  {t.howItWorksTitle}
                </h3>
                <hr className="border-outline-variant mb-6" />
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex flex-col">
                    <span className="font-display-lg text-[28px] sm:text-[34px] font-bold text-secondary-container mb-1 tracking-tight">
                      {t.stat1Value}
                    </span>
                    <span className="font-caption text-[11.5px] sm:text-[12.5px] text-on-surface-variant font-medium leading-tight">
                      {t.stat1Label}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display-lg text-[28px] sm:text-[34px] font-bold text-primary mb-1 tracking-tight">
                      {t.stat2Value}
                    </span>
                    <span className="font-caption text-[11.5px] sm:text-[12.5px] text-on-surface-variant font-medium leading-tight">
                      {t.stat2Label}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display-lg text-[28px] sm:text-[34px] font-bold text-primary mb-1 tracking-tight">
                      {t.stat3Value}
                    </span>
                    <span className="font-caption text-[11.5px] sm:text-[12.5px] text-on-surface-variant font-medium leading-tight">
                      {t.stat3Label}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display-lg text-[28px] sm:text-[34px] font-bold text-secondary-container mb-1 tracking-tight">
                      {t.stat4Value}
                    </span>
                    <span className="font-caption text-[11.5px] sm:text-[12.5px] text-on-surface-variant font-medium leading-tight">
                      {t.stat4Label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Important Notice Banner */}
        <div className="w-full bg-secondary-fixed-dim text-on-secondary-fixed border-y border-outline-variant py-3 px-4 sm:px-6 md:px-8">
          <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3 font-body-md text-xs sm:text-sm md:text-base">
            <AlertTriangle className="h-5 w-5 text-secondary shrink-0 mt-0.5 sm:mt-0" />
            <p>
              <strong>{t.govOfIndia}:</strong> {t.portalSubtitle} — {t.stat3Label}:{" "}
              <strong>30 {t.stat3Value}</strong>.
            </p>
          </div>
        </div>

        {/* What would you like to do? Section */}
        <div className="w-full bg-background py-10 md:py-14 lg:py-18 px-4 sm:px-6 md:px-8">
          <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
            {/* Quick Actions (Bento Grid Style) */}
            <div>
              <h3 className="font-headline-lg-mobile md:font-headline-lg text-xl sm:text-2xl md:text-3xl text-primary font-bold mb-6 sm:mb-8">
                {t.featuresTitle}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                {/* Action Card 1: RTI Copilot */}
                {isSignedIn ? (
                  <Link
                    href="/copilot"
                    className="group bg-surface-container-lowest border-2 border-primary/20 hover:border-primary rounded-xl p-5 sm:p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200 hover:shadow-md hover:-translate-y-1 relative overflow-hidden flex flex-col h-full text-left cursor-pointer"
                  >
                    <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-primary to-emerald-600 absolute top-0 left-0"></div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <Bot className="h-6 w-6" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-headline-md text-lg sm:text-xl text-on-surface font-bold">
                        {t.modalCopilotTitle}
                      </h4>
                      <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">
                        AI
                      </span>
                    </div>
                    <p className="font-body-md text-xs sm:text-sm text-on-surface-variant flex-grow leading-relaxed">
                      {t.feat1Desc}
                    </p>
                    <div className="mt-5 flex items-center text-primary font-label-md text-sm font-semibold group-hover:translate-x-1 transition-transform">
                      {t.modalCopilotBtn} <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </Link>
                ) : (
                  <SignInButton mode="modal">
                    <div
                      role="button"
                      tabIndex={0}
                      className="group bg-surface-container-lowest border-2 border-primary/20 hover:border-primary rounded-xl p-5 sm:p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200 hover:shadow-md hover:-translate-y-1 relative overflow-hidden flex flex-col h-full text-left cursor-pointer"
                    >
                      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-primary to-emerald-600 absolute top-0 left-0"></div>
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                        <Bot className="h-6 w-6" />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-headline-md text-lg sm:text-xl text-on-surface font-bold">
                          {t.modalCopilotTitle}
                        </h4>
                        <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">
                          AI
                        </span>
                      </div>
                      <p className="font-body-md text-xs sm:text-sm text-on-surface-variant flex-grow leading-relaxed">
                        {t.feat1Desc}
                      </p>
                      <div className="mt-5 flex items-center text-primary font-label-md text-sm font-semibold group-hover:translate-x-1 transition-transform">
                        {t.signIn} &amp; {t.modalCopilotBtn} <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </SignInButton>
                )}

                {/* Action Card 2: File First Appeal */}
                <Link
                  href="/first-appeal"
                  className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-5 sm:p-6 hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200 hover:shadow-md hover:-translate-y-1 relative overflow-hidden flex flex-col h-full text-left cursor-pointer"
                >
                  <div className="h-12 w-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <Gavel className="h-6 w-6" />
                  </div>
                  <h4 className="font-headline-md text-lg sm:text-xl text-on-surface font-bold mb-2">
                    {t.navFirstAppeal}
                  </h4>
                  <p className="font-body-md text-xs sm:text-sm text-on-surface-variant flex-grow leading-relaxed">
                    {t.feat6Desc}
                  </p>
                  <div className="mt-5 flex items-center text-primary font-label-md text-sm font-semibold group-hover:translate-x-1 transition-transform">
                    {t.actionFirstAppealBtn} <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </Link>

                {/* Action Card 3: Track Application */}
                {isSignedIn ? (
                  <Link
                    href="/track"
                    className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-5 sm:p-6 hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200 hover:shadow-md hover:-translate-y-1 relative overflow-hidden flex flex-col h-full text-left cursor-pointer"
                  >
                    <div className="h-12 w-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <FileSearch className="h-6 w-6" />
                    </div>
                    <h4 className="font-headline-md text-lg sm:text-xl text-on-surface font-bold mb-2">
                      {t.navTrackStatus}
                    </h4>
                    <p className="font-body-md text-xs sm:text-sm text-on-surface-variant flex-grow leading-relaxed">
                      {t.feat4Desc}
                    </p>
                    <div className="mt-5 flex items-center text-primary font-label-md text-sm font-semibold group-hover:translate-x-1 transition-transform">
                      {t.trackSearchBtn} <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </Link>
                ) : (
                  <SignInButton mode="modal">
                    <div
                      role="button"
                      tabIndex={0}
                      className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-5 sm:p-6 hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200 hover:shadow-md hover:-translate-y-1 relative overflow-hidden flex flex-col h-full text-left cursor-pointer"
                    >
                      <div className="h-12 w-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-colors">
                        <FileSearch className="h-6 w-6" />
                      </div>
                      <h4 className="font-headline-md text-lg sm:text-xl text-on-surface font-bold mb-2">
                        {t.navTrackStatus}
                      </h4>
                      <p className="font-body-md text-xs sm:text-sm text-on-surface-variant flex-grow leading-relaxed">
                        {t.feat4Desc}
                      </p>
                      <div className="mt-5 flex items-center text-primary font-label-md text-sm font-semibold group-hover:translate-x-1 transition-transform">
                        {t.signIn} <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </SignInButton>
                )}

                {/* Action Card 4: Response Analyzer */}
                <Link
                  href="/response-analysis"
                  className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-5 sm:p-6 hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200 hover:shadow-md hover:-translate-y-1 relative overflow-hidden flex flex-col h-full text-left cursor-pointer"
                >
                  <div className="h-12 w-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <History className="h-6 w-6" />
                  </div>
                  <h4 className="font-headline-md text-lg sm:text-xl text-on-surface font-bold mb-2">
                    {t.navResponseAnalysis}
                  </h4>
                  <p className="font-body-md text-xs sm:text-sm text-on-surface-variant flex-grow leading-relaxed">
                    {t.feat5Desc}
                  </p>
                  <div className="mt-5 flex items-center text-primary font-label-md text-sm font-semibold group-hover:translate-x-1 transition-transform">
                    {t.actionAnalyzeRespBtn} <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Process Timeline */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-8 md:p-10 shadow-xs hover:shadow-sm transition-shadow">
              <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
                <span className="text-xs font-bold text-secondary-container tracking-wider uppercase bg-surface-container px-3 py-1 rounded-full">
                  {t.howItWorksBadge}
                </span>
                <h3 className="font-headline-lg-mobile md:font-headline-lg text-xl sm:text-2xl md:text-3xl text-primary font-bold mt-3">
                  {t.howItWorksTitle}
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-2">
                  {t.howItWorksSubtitle}
                </p>
              </div>

              <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center mt-6">
                {/* Horizontal Line (Desktop) */}
                <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-[2px] bg-surface-container-highest z-0 overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-full bg-primary origin-left animate-timeline-line-h"></div>
                </div>
                {/* Vertical Line (Mobile) */}
                <div className="md:hidden absolute top-0 bottom-0 left-6 w-[2px] bg-surface-container-highest z-0 overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-full bg-primary origin-top animate-timeline-line-v"></div>
                </div>

                {/* Step 1 */}
                <div className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-3 md:text-center w-full md:w-1/4 mb-6 sm:mb-8 md:mb-0 group/step">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-headline-md shrink-0 border-2 transition-all duration-500 animate-step-1 font-bold bg-primary text-on-primary">
                    1
                  </div>
                  <div>
                    <h4 className="font-headline-md text-sm sm:text-base md:text-lg text-on-surface font-bold">
                      {t.step1Title}
                    </h4>
                    <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1">
                      {t.step1Desc}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-3 md:text-center w-full md:w-1/4 mb-6 sm:mb-8 md:mb-0 group/step">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-headline-md shrink-0 border-2 transition-all duration-500 animate-step-2 font-bold bg-primary text-on-primary">
                    2
                  </div>
                  <div>
                    <h4 className="font-headline-md text-sm sm:text-base md:text-lg text-on-surface font-bold">
                      {t.step2Title}
                    </h4>
                    <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1">
                      {t.step2Desc}
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-3 md:text-center w-full md:w-1/4 mb-6 sm:mb-8 md:mb-0 group/step">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-headline-md shrink-0 border-2 transition-all duration-500 animate-step-3 font-bold bg-primary text-on-primary">
                    3
                  </div>
                  <div>
                    <h4 className="font-headline-md text-sm sm:text-base md:text-lg text-on-surface font-bold">
                      {t.step3Title}
                    </h4>
                    <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1">
                      {t.step3Desc}
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-3 md:text-center w-full md:w-1/4 group/step">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-headline-md shrink-0 border-2 transition-all duration-500 animate-step-4 font-bold bg-primary text-on-primary">
                    4
                  </div>
                  <div>
                    <h4 className="font-headline-md text-sm sm:text-base md:text-lg text-on-surface font-bold">
                      {t.step4Title}
                    </h4>
                    <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-1">
                      {t.step4Desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Public Authority Directory Search */}
            <div className="bg-primary-container rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
              <div className="w-full md:w-1/2">
                <h3 className="font-headline-lg-mobile md:font-headline-lg text-xl sm:text-2xl md:text-3xl text-on-primary font-bold mb-2 sm:mb-3">
                  {t.feat2Title}
                </h3>
                <p className="font-body-md text-xs sm:text-sm md:text-base text-inverse-primary leading-relaxed">
                  {t.feat2Desc}
                </p>
              </div>
              <div className="w-full md:w-1/2 flex flex-col gap-3">
                <div className="relative w-full">
                  <Search className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-outline-variant" />
                  <input
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-sm md:text-base focus:ring-2 focus:ring-secondary-container focus:border-secondary-container outline-none transition-all h-[48px]"
                    placeholder={t.heroTrackPlaceholder}
                    type="text"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary dark:bg-primary-container text-on-primary dark:text-on-primary-container font-caption text-caption full-width bottom-0 mt-auto border-t-[8px] border-secondary-container">
        <div className="w-full py-8 px-4 sm:px-6 md:px-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-6 md:gap-0">
          <div className="flex flex-col items-center md:items-start gap-1.5 text-center md:text-left">
            <div className="flex items-center gap-3">
              <img
                src="/viksit-india.png"
                alt="Viksit India"
                className="h-7 w-auto object-contain brightness-110"
              />
              <span className="font-label-md text-label-md font-bold text-on-primary text-base">
                {t.portalTitle}
              </span>
            </div>
            <p className="text-on-primary opacity-80 text-xs">
              {t.footerCopyright}
            </p>
            <p className="text-on-primary opacity-70 text-[11px]">
              {t.footerHelpline}
            </p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-4 sm:gap-6 text-xs">
            <Link
              className="text-on-primary opacity-80 hover:opacity-100 hover:text-secondary-fixed cursor-pointer transition-opacity font-semibold"
              href="/copilot"
            >
              {t.navCopilot}
            </Link>
            <Link
              className="text-on-primary opacity-80 hover:opacity-100 hover:text-secondary-fixed cursor-pointer transition-opacity font-semibold"
              href="/first-appeal"
            >
              {t.navFirstAppeal}
            </Link>
            <Link
              className="text-on-primary opacity-80 hover:opacity-100 hover:text-secondary-fixed cursor-pointer transition-opacity font-semibold"
              href="/response-analysis"
            >
              {t.navResponseAnalysis}
            </Link>
            <Link
              className="text-on-primary opacity-80 hover:opacity-100 hover:text-secondary-fixed cursor-pointer transition-opacity font-semibold"
              href="/faq"
            >
              {t.navFaq}
            </Link>
          </div>
        </div>
      </footer>

      {/* File RTI Choice Modal: Copilot vs Manual */}
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
    </>
  );
}
