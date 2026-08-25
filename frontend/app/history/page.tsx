"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/track?screen=screen2");
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-on-surface-variant font-medium text-sm">Loading RTI History...</div>
    </div>
  );
}
