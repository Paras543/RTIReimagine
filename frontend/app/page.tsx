"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Search,
  Gavel,
  FileSearch,
  History,
  ArrowRight,
  Menu,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { FileRtiChoiceModal } from "@/components/file-rti-choice-modal";

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);


  return (
    <>
      {/* Utility Bar */}
      <div className="bg-surface-container-high py-1.5 px-4 md:px-8 w-full border-b border-outline-variant">
        <div className="max-w-7xl mx-auto flex justify-between items-center font-caption text-caption text-on-surface-variant">
          <div className="flex items-center gap-2">
            <img
              className="h-4 w-4 object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9CEDKjhx9PkfRYl6NYdCt_XnxAHtU9M9rZhXre46VzsXyUMLtJPdI8KN5YcBiYXrUFW4mlgzGt-1lSXAgNjCnoFkSWgjG2LT2FvTXewx201vGgO6lHdtV34nRCotr3j7t5JjqMeAOlbapZk5hiY9FzH29xV14tvcddk4DcxJtMHhQIJOBSHcUnAkuoEK1USbK4Pmq1V4oEzEhDPefdkEOY4GMiyocIXPbXGZbcR4wuulJ2CpT-Lvq"
              alt="Emblem"
            />
            <span>Government of India</span>
            <span className="w-[1px] h-3 bg-outline-variant mx-1"></span>
            <div className="flex items-center gap-1">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg"
                className="h-3 w-auto object-contain"
                alt="Indian Flag"
              />
              <span className="font-label-md text-[10px] uppercase tracking-tighter opacity-70">
                Made in India
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <a
              className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              href="#main-content"
            >
              Skip to Main Content
            </a>
            <span className="w-[1px] h-3 bg-outline-variant"></span>
            <a
              className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              href="#"
            >
              Accessibility Options
            </a>
            <span className="w-[1px] h-3 bg-outline-variant"></span>
            <div className="flex gap-1">
              <button className="font-bold text-primary px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                A
              </button>
              <button className="text-on-surface-variant hover:text-primary px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                A-
              </button>
              <button className="text-on-surface-variant hover:text-primary px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                A+
              </button>
            </div>
            <span className="w-[1px] h-3 bg-outline-variant"></span>
            <select className="bg-transparent border-none text-caption font-caption text-on-surface-variant py-0 pr-6 pl-2 focus:ring-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-surface-container-lowest border-b border-outline-variant py-3 px-4 md:px-8 w-full">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-6">
            <img
              className="h-16 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKNgfcj8pGfbImVV9qFRR7dMonANec5PBYViLmUSvnISJaOa80b8OGK-gSkAKIFUnepxJx3wZvwL9YLS8TgOhIrTsu85fmikN_ITgaLprlLfyMYA8cEyu9S4U_Swo7UqGznE3DroPRfTPKtMgRoNXBK8CXKQAFqGBhVddbYnGDhXHdV134e_-2LuIhA886-SaFZH931WR1KHMEvy0VtXOuRxnuysHSANc-uS3-YEflsXOVhkVGMPHn"
              alt="Emblem of India"
            />
            <div>
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary font-bold">
                RTI Online
              </h1>
              <p className="font-caption text-caption text-on-surface-variant mt-0.5">
                An initiative of Department of Personnel &amp; Training
              </p>
            </div>
          </div>
          {/* Mobile Menu Toggle */}
          <button
            aria-label="Toggle Menu"
            className="md:hidden absolute top-[60px] right-4 p-2 text-on-surface hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Menu className="h-6 w-6 text-on-surface" />
          </button>
        </div>
      </header>

      {/* TopNavBar */}
      <nav className="bg-surface-container-lowest dark:bg-surface-container-lowest font-body-md text-body-md border-b border-outline-variant sticky top-0 z-30 shadow-xs">
        <div className="flex justify-between items-center px-4 md:px-8 w-full max-w-7xl mx-auto h-16 overflow-x-auto no-scrollbar">
          {/* Navigation Links */}
          <div className="flex items-center gap-6 h-full min-w-max">
            <a
              className="text-primary font-bold border-b-2 border-secondary-container pb-1 h-full flex items-center hover:bg-surface-container-low transition-colors px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              href="#"
            >
              Home
            </a>

            {/* File RTI — opens choice modal directly on first click */}
            <button
              id="nav-file-rti"
              onClick={() => setIsChoiceModalOpen(true)}
              className="text-on-surface-variant hover:text-primary h-full flex items-center hover:bg-surface-container-low transition-colors px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer font-medium"
            >
              File RTI
            </button>

            {/* Track Status */}
            {isSignedIn ? (
              <Link
                id="nav-track-status"
                className="text-on-surface-variant hover:text-primary h-full flex items-center hover:bg-surface-container-low transition-colors px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-medium"
                href="/track"
              >
                Track Status
              </Link>
            ) : (
              <SignInButton mode="modal">
                <button
                  id="nav-track-status"
                  className="text-on-surface-variant hover:text-primary h-full flex items-center hover:bg-surface-container-low transition-colors px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-medium cursor-pointer"
                >
                  Track Status
                </button>
              </SignInButton>
            )}

            {/* My History */}
            {isSignedIn ? (
              <Link
                id="nav-my-history"
                className="text-on-surface-variant hover:text-primary h-full flex items-center hover:bg-surface-container-low transition-colors px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-medium"
                href="/history"
              >
                My History
              </Link>
            ) : (
              <SignInButton mode="modal">
                <button
                  id="nav-my-history"
                  className="text-on-surface-variant hover:text-primary h-full flex items-center hover:bg-surface-container-low transition-colors px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-medium cursor-pointer"
                >
                  My History
                </button>
              </SignInButton>
            )}

            {/* FAQ */}
            <Link
              className="text-on-surface-variant hover:text-primary h-full flex items-center hover:bg-surface-container-low transition-colors px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-medium"
              href="/faq"
            >
              FAQ
            </Link>
          </div>

          {/* Trailing Actions */}
          <div className="hidden md:flex items-center gap-3 h-full shrink-0">
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
                <button
                  id="nav-login-btn"
                  className="font-label-md text-label-md text-on-surface hover:text-primary hover:bg-surface-container-low px-4 py-2 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-medium"
                >
                  Login / Register
                </button>
              </SignInButton>
            )}
            <button
              id="nav-file-request-btn"
              onClick={() => setIsChoiceModalOpen(true)}
              className="bg-secondary-container text-on-secondary-container font-label-md text-label-md px-6 py-2.5 rounded font-bold hover:brightness-110 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer shadow-xs"
            >
              File New Request
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow flex flex-col w-full" id="main-content">
        {/* Hero Section */}
        <section className="relative w-full bg-surface-container py-20 lg:py-24 overflow-hidden bg-pattern-gov px-4 md:px-8">
          <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-7 flex flex-col gap-6 z-20">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="h-5 w-5 text-secondary-container" />
                <span className="font-label-md text-sm text-on-surface-variant font-bold uppercase tracking-widest">
                  Official Portal of Government of India
                </span>
              </div>

              <h2 className="font-display-lg text-[42px] lg:text-[54px] text-primary font-bold leading-[1.12] max-w-2xl tracking-tight">
                Your Right to Information,<br />
                <span className="text-secondary-container">Online.</span>
              </h2>

              <p className="font-body-lg text-[17px] lg:text-[18px] text-on-surface-variant max-w-[520px] leading-relaxed">
                File RTI applications and first appeals with Central Government public authorities securely. Track your application, view responses, and manage your complete RTI history online.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <Button
                  id="hero-file-rti-btn"
                  onClick={() => setIsChoiceModalOpen(true)}
                  className="bg-primary text-on-primary font-label-md text-base font-semibold px-6 h-12 rounded hover:bg-primary-container transition-colors flex justify-center items-center gap-2 cursor-pointer shadow-xs"
                >
                  <FileText className="h-5 w-5" />
                  File an RTI Request
                </Button>
                {isSignedIn ? (
                  <Button
                    variant="outline"
                    onClick={() => router.push("/track")}
                    className="bg-surface-container-lowest border border-outline-variant text-primary font-label-md text-base font-semibold px-6 h-12 rounded hover:bg-surface-container-low transition-colors flex justify-center items-center gap-2 cursor-pointer"
                  >
                    <Search className="h-5 w-5" />
                    Track My Application
                  </Button>
                ) : (
                  <SignInButton mode="modal">
                    <Button
                      variant="outline"
                      className="bg-surface-container-lowest border border-outline-variant text-primary font-label-md text-base font-semibold px-6 h-12 rounded hover:bg-surface-container-low transition-colors flex justify-center items-center gap-2 cursor-pointer"
                    >
                      <Search className="h-5 w-5" />
                      Track My Application
                    </Button>
                  </SignInButton>
                )}
              </div>
            </div>

            <div className="md:col-span-5 flex justify-center md:justify-end relative z-20">
              <div className="w-full max-w-[420px] bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm">
                <h3 className="font-headline-md text-[22px] text-primary font-bold mb-4">Quick Stats</h3>
                <hr className="border-outline-variant mb-6" />
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <span className="font-display-lg text-[38px] font-bold text-secondary-container mb-1 tracking-tight">
                      2.4M+
                    </span>
                    <span className="font-caption text-[13px] text-on-surface-variant font-medium">
                      Requests Processed
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display-lg text-[38px] font-bold text-primary mb-1 tracking-tight">
                      2,400+
                    </span>
                    <span className="font-caption text-[13px] text-on-surface-variant font-medium">
                      Public Authorities
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Important Notice Banner */}
        <div className="w-full bg-secondary-fixed-dim text-on-secondary-fixed border-y border-outline-variant py-3 px-4 md:px-8">
          <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3 font-body-md text-sm md:text-base">
            <AlertTriangle className="h-5 w-5 text-secondary shrink-0 mt-0.5 sm:mt-0" />
            <p>
              <strong>Important:</strong> This portal is for filing RTI requests with{" "}
              <strong>Central Government</strong> authorities only. Requests intended for State
              Governments must be filed through their respective state portals.
            </p>
          </div>
        </div>

        {/* What would you like to do? Section */}
        <div className="w-full bg-background py-14 lg:py-18 px-4 md:px-8">
          <div className="max-w-7xl mx-auto space-y-16">
            {/* Quick Actions (Bento Grid Style) */}
            <div>
              <h3 className="font-headline-lg-mobile md:font-headline-lg text-2xl md:text-3xl text-primary font-bold mb-8">
                What would you like to do?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Action Card 1 */}
                <button
                  onClick={() => setIsChoiceModalOpen(true)}
                  className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-6 hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200 hover:shadow-md hover:-translate-y-1 relative overflow-hidden flex flex-col h-full text-left cursor-pointer"
                >
                  <div className="h-1 w-full bg-primary absolute top-0 left-0"></div>
                  <div className="h-12 w-12 rounded-full bg-primary-fixed flex items-center justify-center mb-4 text-on-primary-fixed group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h4 className="font-headline-md text-xl text-on-surface font-bold mb-2">
                    File an RTI
                  </h4>
                  <p className="font-body-md text-sm text-on-surface-variant flex-grow leading-relaxed">
                    Submit a new Right to Information request to a Central Government Ministry or Department.
                  </p>
                  <div className="mt-5 flex items-center text-primary font-label-md text-sm font-semibold group-hover:translate-x-1 transition-transform">
                    Start application <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </button>

                {/* Action Card 2: File First Appeal */}
                <Link
                  href="/first-appeal"
                  className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-6 hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200 hover:shadow-md hover:-translate-y-1 relative overflow-hidden flex flex-col h-full text-left cursor-pointer"
                >
                  <div className="h-12 w-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <Gavel className="h-6 w-6" />
                  </div>
                  <h4 className="font-headline-md text-xl text-on-surface font-bold mb-2">
                    File First Appeal
                  </h4>
                  <p className="font-body-md text-sm text-on-surface-variant flex-grow leading-relaxed">
                    Appeal a decision or report a delayed response from a previous RTI request.
                  </p>
                  <div className="mt-5 flex items-center text-primary font-label-md text-sm font-semibold group-hover:translate-x-1 transition-transform">
                    Submit appeal <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </Link>

                {/* Action Card 3: Track Application */}
                {isSignedIn ? (
                  <Link
                    href="/track"
                    className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-6 hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200 hover:shadow-md hover:-translate-y-1 relative overflow-hidden flex flex-col h-full text-left cursor-pointer"
                  >
                    <div className="h-12 w-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <FileSearch className="h-6 w-6" />
                    </div>
                    <h4 className="font-headline-md text-xl text-on-surface font-bold mb-2">
                      Track Application
                    </h4>
                    <p className="font-body-md text-sm text-on-surface-variant flex-grow leading-relaxed">
                      Check the current status and view responses for your submitted RTI applications.
                    </p>
                    <div className="mt-5 flex items-center text-primary font-label-md text-sm font-semibold group-hover:translate-x-1 transition-transform">
                      Check status <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </Link>
                ) : (
                  <SignInButton mode="modal">
                    <div
                      role="button"
                      tabIndex={0}
                      className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-6 hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200 hover:shadow-md hover:-translate-y-1 relative overflow-hidden flex flex-col h-full text-left cursor-pointer"
                    >
                      <div className="h-12 w-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-colors">
                        <FileSearch className="h-6 w-6" />
                      </div>
                      <h4 className="font-headline-md text-xl text-on-surface font-bold mb-2">
                        Track Application
                      </h4>
                      <p className="font-body-md text-sm text-on-surface-variant flex-grow leading-relaxed">
                        Check the current status and view responses for your submitted RTI applications.
                      </p>
                      <div className="mt-5 flex items-center text-primary font-label-md text-sm font-semibold group-hover:translate-x-1 transition-transform">
                        Sign in to track <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </SignInButton>
                )}

                {/* Action Card 4: View History */}
                {isSignedIn ? (
                  <Link
                    href="/history"
                    className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-6 hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200 hover:shadow-md hover:-translate-y-1 relative overflow-hidden flex flex-col h-full text-left cursor-pointer"
                  >
                    <div className="h-12 w-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <History className="h-6 w-6" />
                    </div>
                    <h4 className="font-headline-md text-xl text-on-surface font-bold mb-2">
                      View History
                    </h4>
                    <p className="font-body-md text-sm text-on-surface-variant flex-grow leading-relaxed">
                      Access your complete archive of past RTI requests, appeals, and official responses.
                    </p>
                    <div className="mt-5 flex items-center text-primary font-label-md text-sm font-semibold group-hover:translate-x-1 transition-transform">
                      Go to dashboard <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </Link>
                ) : (
                  <SignInButton mode="modal">
                    <div
                      role="button"
                      tabIndex={0}
                      className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-6 hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all duration-200 hover:shadow-md hover:-translate-y-1 relative overflow-hidden flex flex-col h-full text-left cursor-pointer"
                    >
                      <div className="h-12 w-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 text-on-surface-variant group-hover:bg-primary group-hover:text-on-primary transition-colors">
                        <History className="h-6 w-6" />
                      </div>
                      <h4 className="font-headline-md text-xl text-on-surface font-bold mb-2">
                        View History
                      </h4>
                      <p className="font-body-md text-sm text-on-surface-variant flex-grow leading-relaxed">
                        Access your complete archive of past RTI requests, appeals, and official responses.
                      </p>
                      <div className="mt-5 flex items-center text-primary font-label-md text-sm font-semibold group-hover:translate-x-1 transition-transform">
                        Sign in to view <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </SignInButton>
                )}

              </div>
            </div>

            {/* Process Timeline */}


            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 md:p-10 shadow-xs hover:shadow-sm transition-shadow">
              <h3 className="font-headline-lg-mobile md:font-headline-lg text-2xl md:text-3xl text-primary font-bold mb-10 text-center">
                How RTI Online Works
              </h3>
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
                <div className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-3 md:text-center w-full md:w-1/4 mb-8 md:mb-0 group/step">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-headline-md shrink-0 border-2 transition-all duration-500 animate-step-1 font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-headline-md text-base md:text-lg text-on-surface font-bold">
                      Choose Authority
                    </h4>
                    <p className="font-body-md text-xs md:text-sm text-on-surface-variant mt-1">
                      Select the correct Central Ministry or Department.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-3 md:text-center w-full md:w-1/4 mb-8 md:mb-0 group/step">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-headline-md shrink-0 border-2 transition-all duration-500 animate-step-2 font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-headline-md text-base md:text-lg text-on-surface font-bold">
                      Write Request
                    </h4>
                    <p className="font-body-md text-xs md:text-sm text-on-surface-variant mt-1">
                      Clearly state the information you are seeking.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-3 md:text-center w-full md:w-1/4 mb-8 md:mb-0 group/step">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-headline-md shrink-0 border-2 transition-all duration-500 animate-step-3 font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-headline-md text-base md:text-lg text-on-surface font-bold">
                      Pay Fee
                    </h4>
                    <p className="font-body-md text-xs md:text-sm text-on-surface-variant mt-1">
                      Pay the standard ₹10 fee securely online.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-3 md:text-center w-full md:w-1/4 group/step">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-headline-md shrink-0 border-2 transition-all duration-500 animate-step-4 font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-headline-md text-base md:text-lg text-on-surface font-bold">
                      Track Status
                    </h4>
                    <p className="font-body-md text-xs md:text-sm text-on-surface-variant mt-1">
                      Monitor progress and receive official replies.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Directory Search */}
            <div className="bg-primary-container rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="w-full md:w-1/2">
                <h3 className="font-headline-lg-mobile md:font-headline-lg text-2xl md:text-3xl text-on-primary font-bold mb-3">
                  Find a Public Authority
                </h3>
                <p className="font-body-md text-sm md:text-base text-inverse-primary leading-relaxed">
                  Search our comprehensive directory of Central Government Ministries, Departments, and attached offices to direct your RTI query correctly.
                </p>
              </div>
              <div className="w-full md:w-1/2 flex flex-col gap-3">
                <div className="relative w-full">
                  <Search className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-outline-variant" />
                  <input
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-sm md:text-base focus:ring-2 focus:ring-secondary-container focus:border-secondary-container outline-none transition-all h-[48px]"
                    placeholder="Search by Ministry, Department, or keyword..."
                    type="text"
                  />
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                  <span className="font-caption text-xs md:text-sm text-inverse-primary mr-1">
                    Popular filters:
                  </span>
                  <button className="px-3 py-1 bg-surface-tint bg-opacity-20 text-on-primary rounded-full font-caption text-xs hover:bg-opacity-40 transition-colors border border-surface-tint">
                    Finance
                  </button>
                  <button className="px-3 py-1 bg-surface-tint bg-opacity-20 text-on-primary rounded-full font-caption text-xs hover:bg-opacity-40 transition-colors border border-surface-tint">
                    Railways
                  </button>
                  <button className="px-3 py-1 bg-surface-tint bg-opacity-20 text-on-primary rounded-full font-caption text-xs hover:bg-opacity-40 transition-colors border border-surface-tint">
                    Home Affairs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary dark:bg-primary-container text-on-primary dark:text-on-primary-container font-caption text-caption full-width bottom-0 mt-auto border-t-[8px] border-secondary-container">
        <div className="w-full py-8 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-6 md:gap-0">
          <div className="flex flex-col items-center md:items-start gap-1.5">
            <span className="font-label-md text-label-md font-bold text-on-primary text-base">
              RTI Online
            </span>
            <p className="text-on-primary opacity-80 text-xs">
              © 2024 RTI Online. Designed and Developed by National Informatics Centre (NIC).
            </p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-6 text-xs">
            <a
              className="text-on-primary opacity-80 hover:opacity-100 hover:text-secondary-fixed cursor-pointer transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-fixed"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-on-primary opacity-80 hover:opacity-100 hover:text-secondary-fixed cursor-pointer transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-fixed"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="text-on-primary opacity-80 hover:opacity-100 hover:text-secondary-fixed cursor-pointer transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-fixed"
              href="#"
            >
              Contact Us
            </a>
            <Link
              className="text-on-primary opacity-80 hover:opacity-100 hover:text-secondary-fixed cursor-pointer transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-fixed font-semibold"
              href="/faq"
            >
              Help Desk / FAQ
            </Link>
            <a
              className="text-on-primary opacity-80 hover:opacity-100 hover:text-secondary-fixed cursor-pointer transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-fixed"
              href="#"
            >
              Accessibility Statement
            </a>
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
