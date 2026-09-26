"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [planCount, setPlanCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  const updateCounts = () => {
    try {
      const plan = JSON.parse(localStorage.getItem("todaysPlan") || "[]");
      const saved = JSON.parse(localStorage.getItem("savedExercises") || "[]");
      setPlanCount(Array.isArray(plan) ? plan.length : 0);
      setSavedCount(Array.isArray(saved) ? saved.length : 0);
    } catch (error) {
      console.error("Count update error:", error);
    }
  };

  useEffect(() => {
    window.addEventListener("fitlog-storage-update", updateCounts);
    window.addEventListener("storage", updateCounts);
    return () => {
      window.removeEventListener("fitlog-storage-update", updateCounts);
      window.removeEventListener("storage", updateCounts);
    };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(updateCounts);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[#1b1e22] bg-[#08090b]">
      <div className="mx-auto flex h-16 w-full max-w-275 items-center justify-between px-4 sm:px-7">
        <Link href="/" className="shrink-0 text-lg font-black uppercase tracking-tight text-white">
          FIT<span className="text-[#d6ff38]">LOG</span>
        </Link>

        <nav className="hidden items-center gap-2 sm:flex">
          <Link href="/#library" className="rounded-md px-4 py-2 text-[9px] font-bold uppercase tracking-wide text-[#858a91] transition hover:bg-[#15181e] hover:text-white">
            Workout
          </Link>
          <Link href="/my-plan?tab=plan" className="rounded-md bg-[#171a20] px-4 py-2 text-[9px] font-bold uppercase tracking-wide text-white">
            My Plan
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          
          <Link href="/my-plan?tab=plan" className="flex items-center gap-2 rounded-md border border-[#24272c] bg-[#101216] px-2.5 py-2 transition hover:border-[#3a3f46]">
            <span className="text-[8px] font-bold uppercase tracking-wide text-[#858a91]">Plan</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d6ff38] px-1 text-[9px] font-black text-black">
              {planCount}
            </span>
          </Link>

          <Link href="/my-plan?tab=saved" className="flex items-center gap-2 rounded-md border border-[#24272c] bg-[#101216] px-2.5 py-2 transition hover:border-[#3a3f46]">
            <span className="text-[8px] font-bold uppercase tracking-wide text-[#858a91]">Saved</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full border border-[#42474e] px-1 text-[9px] font-black text-[#c5c9ce]">
              {savedCount}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}