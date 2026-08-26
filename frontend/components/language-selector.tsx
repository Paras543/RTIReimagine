"use client";

import { useLanguage } from "@/lib/language-context";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  variant?: "select" | "toggle" | "pill";
  className?: string;
}

export function LanguageSelector({ variant = "select", className = "" }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();

  if (variant === "toggle" || variant === "pill") {
    return (
      <div className={`inline-flex items-center bg-surface-container border border-outline-variant/60 rounded-full p-0.5 ${className}`}>
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
            language === "en"
              ? "bg-primary text-on-primary shadow-xs"
              : "text-on-surface-variant hover:text-primary"
          }`}
          aria-label="Switch to English"
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setLanguage("hi")}
          className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
            language === "hi"
              ? "bg-primary text-on-primary shadow-xs"
              : "text-on-surface-variant hover:text-primary"
          }`}
          aria-label="हिंदी में बदलें"
        >
          हिन्दी
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Globe className="h-3.5 w-3.5 text-on-surface-variant shrink-0" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
        aria-label="Select Language"
        className="bg-transparent border border-outline-variant/50 hover:border-primary/60 rounded-md text-caption font-caption text-on-surface-variant py-0.5 pr-6 pl-2 focus:ring-1 focus:ring-primary cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary transition-colors text-xs font-medium"
      >
        <option value="en" className="bg-surface-container-lowest text-on-surface">
          English
        </option>
        <option value="hi" className="bg-surface-container-lowest text-on-surface">
          हिन्दी (Hindi)
        </option>
      </select>
    </div>
  );
}
