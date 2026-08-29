import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex flex-col justify-between bg-surface-container py-8 px-4">
      {/* Top bar back link */}
      <div className="max-w-md w-full mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-container font-label-md text-sm font-semibold transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to RTI Portal
        </Link>
      </div>

      {/* Center Auth Card */}
      <div className="flex flex-col items-center gap-5 my-auto w-full max-w-md mx-auto">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-2">
            <img
              src="/viksit-india.png"
              alt="Viksit India"
              className="h-12 w-auto object-contain"
            />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg"
              className="h-4 w-auto object-contain drop-shadow-xs"
              alt="Flag of India"
            />
            <span className="font-caption text-xs uppercase tracking-wider font-bold text-on-surface-variant">
              Government of India
            </span>
          </div>
          <h1 className="font-headline-lg text-2xl sm:text-3xl text-primary font-bold">
            Citizen Registration
          </h1>
          <p className="text-body-md text-sm text-on-surface-variant mt-1 max-w-sm">
            Create an official citizen account with your Name, Email and Phone Number
          </p>
        </div>

        <div className="w-full flex justify-center">
          <SignUp />
        </div>
      </div>

      {/* Footer disclaimer */}
      <footer className="text-center font-caption text-xs text-on-surface-variant/70 mt-8">
        Department of Personnel &amp; Training • National Informatics Centre (NIC) • Viksit Bharat 2047
      </footer>
    </main>
  );
}
