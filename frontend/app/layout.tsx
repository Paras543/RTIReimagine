import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";

import { LanguageProvider } from "@/lib/language-context";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RTI Online - Government of India",
  description:
    "File RTI applications and first appeals with Central Government public authorities securely. Viksit Bharat 2047.",
  icons: {
    icon: [
      { url: "/viksit-india.png", sizes: "any" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/viksit-india.png",
    apple: "/viksit-india.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={{
        signIn: {
          start: {
            title: "Citizen Sign In",
            subtitle: "Access your RTI applications and history",
            actionText: "Not registered?",
            actionLink: "Sign up",
          },
        },
        signUp: {
          start: {
            title: "Citizen Registration",
            subtitle: "Provide your name, email & phone number to register",
            actionText: "Already registered?",
            actionLink: "Sign in",
          },
        },
      }}
      appearance={{
        variables: {
          colorPrimary: "#001f3f",
          colorBackground: "#ffffff",
          borderRadius: "0.5rem",
          fontFamily: "Inter, sans-serif",
        },
        elements: {
          footerPages: "hidden",
          modalBackdrop: "bg-black/60 backdrop-blur-xs",
          card: "shadow-2xl border border-outline-variant/40 rounded-xl overflow-hidden bg-surface-container-lowest",
          headerTitle: "text-primary font-bold text-xl font-headline-md tracking-tight text-center",
          headerSubtitle: "text-on-surface-variant text-sm font-body-md text-center",
          formButtonPrimary: "bg-primary hover:bg-primary-container text-on-primary font-semibold py-2.5 rounded transition-all shadow-sm",
          socialButtonsBlockButton: "border border-outline-variant hover:bg-surface-container-low transition-colors text-on-surface font-medium",
          formFieldInput: "border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded bg-surface-container-lowest",
          footerAction: "border-t border-outline-variant/30 pt-4 mt-3 flex justify-center items-center text-sm font-body-md text-on-surface-variant",
          footerActionText: "text-on-surface-variant text-sm",
          footerActionLink: "text-secondary font-bold hover:underline hover:text-secondary-container transition-colors ml-1",
        },
      }}
    >
      <html lang="en" className={cn("light h-full antialiased", "font-sans", geist.variable)}>
        <head>
          <link rel="icon" href="/viksit-india.png" type="image/png" />
          <link rel="shortcut icon" href="/viksit-india.png" type="image/png" />
          <link rel="apple-touch-icon" href="/viksit-india.png" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          />
        </head>
        <body className={`${inter.className} min-h-full flex flex-col`}>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
