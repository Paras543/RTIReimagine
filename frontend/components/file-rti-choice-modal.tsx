"use client";

import { useAuth, SignInButton } from "@clerk/nextjs";
import { X, Bot, Sparkles, FileEdit, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface FileRtiChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCopilot: () => void;
  onSelectManual: () => void;
}

export function FileRtiChoiceModal({
  isOpen,
  onClose,
  onSelectCopilot,
  onSelectManual,
}: FileRtiChoiceModalProps) {
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Choice Card */}
      <div className="relative w-full max-w-[860px] bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-2xl z-10 overflow-hidden my-auto">
        {/* Top Tricolor Accent Border */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#fd8534] via-[#001f3f] to-[#138808]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-6 py-8 sm:px-10 sm:py-10">
          {/* Header Section */}
          <div className="text-center w-full max-w-[620px] mx-auto mb-8 sm:mb-9">
            <h2 className="text-[28px] sm:text-[36px] md:text-[40px] text-[#001f3f] font-extrabold tracking-tight leading-[1.15]">
              Right to Information<br />
              made accessible.
            </h2>
            <p className="text-[14px] sm:text-[15.5px] text-slate-600 font-normal mt-3 leading-relaxed">
              Empowering citizens to seek information from the Government of India.
              <br className="hidden sm:inline" /> Choose how you want to file your request today.
            </p>
          </div>

          {/* 2-Card Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 w-full">
            {/* Card 1: RTI Copilot */}
            <div className="bg-white border border-slate-200 hover:border-slate-300/90 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_-4px_rgba(0,31,63,0.09)] transition-all">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="h-12 w-12 rounded-xl bg-[#e8f1fd] flex items-center justify-center text-[#1a56db]">
                    <Bot className="h-6 w-6" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 bg-[#fff3ea] text-[#c2410c] border border-[#ffddc2] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    <Sparkles className="h-3 w-3 text-[#ea580c]" />
                    AI-ASSISTED
                  </span>
                </div>

                <h3 className="text-[21px] sm:text-[22px] font-bold text-[#001f3f] mb-2.5">
                  RTI Copilot
                </h3>
                <p className="text-[14px] text-slate-600 font-normal leading-[1.6]">
                  Not sure how to write your RTI? Let the Copilot help you prepare it. We will guide you through the process, ensure legal framing, and draft the request for you.
                </p>
              </div>

              <div className="mt-7">
                {isSignedIn ? (
                  <Button
                    id="modal-copilot-start-btn"
                    onClick={onSelectCopilot}
                    className="w-full bg-[#001f3f] hover:bg-[#12355b] text-white font-semibold text-[14.5px] py-3.5 h-auto rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                  >
                    Start with RTI Copilot <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <SignInButton mode="modal">
                    <Button
                      id="modal-copilot-start-btn"
                      className="w-full bg-[#001f3f] hover:bg-[#12355b] text-white font-semibold text-[14.5px] py-3.5 h-auto rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                    >
                      Start with RTI Copilot <ArrowRight className="h-4 w-4" />
                    </Button>
                  </SignInButton>
                )}
              </div>
            </div>

            {/* Card 2: File manually */}
            <div className="bg-white border border-slate-200 hover:border-slate-300/90 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_-4px_rgba(0,31,63,0.09)] transition-all">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="h-12 w-12 rounded-xl bg-[#f1f5f9] flex items-center justify-center text-slate-700">
                    <FileEdit className="h-6 w-6" />
                  </div>
                </div>

                <h3 className="text-[21px] sm:text-[22px] font-bold text-[#001f3f] mb-2.5">
                  File manually
                </h3>
                <p className="text-[14px] text-slate-600 font-normal leading-[1.6] mb-5">
                  Submit your RTI request directly if you already know the appropriate public authority and have your query drafted.
                </p>

                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-slate-700 text-[13.5px] font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Standard submission form</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 text-[13.5px] font-medium">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Direct payment gateway</span>
                  </div>
                </div>
              </div>

              <div className="mt-7">
                {isSignedIn ? (
                  <Button
                    id="modal-manual-file-btn"
                    onClick={onSelectManual}
                    variant="outline"
                    className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-[#001f3f] font-semibold text-[14.5px] py-3.5 h-auto rounded-xl flex items-center justify-center transition-all cursor-pointer"
                  >
                    Submit Request
                  </Button>
                ) : (
                  <SignInButton mode="modal">
                    <Button
                      id="modal-manual-file-btn"
                      variant="outline"
                      className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-[#001f3f] font-semibold text-[14.5px] py-3.5 h-auto rounded-xl flex items-center justify-center transition-all cursor-pointer"
                    >
                      Submit Request
                    </Button>
                  </SignInButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
