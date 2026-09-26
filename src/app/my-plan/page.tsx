"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type Exercise = {
  id: number;
  name: string;
  image: string;
  muscleGroups: string[];
  equipment: string;
  difficulty: string;
  duration: number;
  caloriesBurned: number;
  sets: number;
  reps: string;
  rating: number;
  description: string;
  instructions: string[];
};

function MyPlanContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabQuery = searchParams.get("tab");

  const activeTab: "plan" | "saved" = tabQuery === "saved" ? "saved" : "plan";
  const [todayPlan, setTodayPlan] = useState<Exercise[]>([]);
  const [savedExercises, setSavedExercises] = useState<Exercise[]>([]);
  const [sortBy, setSortBy] = useState("Duration");

  const loadData = () => {
    try {
      const plan = JSON.parse(localStorage.getItem("todaysPlan") || "[]");
      const saved = JSON.parse(localStorage.getItem("savedExercises") || "[]");
      setTodayPlan(Array.isArray(plan) ? plan : []);
      setSavedExercises(Array.isArray(saved) ? saved : []);
    } catch (error) {
      console.error("Failed to load storage data", error);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(loadData, 0);
    window.addEventListener("fitlog-storage-update", loadData);
    window.addEventListener("storage", loadData);
    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("fitlog-storage-update", loadData);
      window.removeEventListener("storage", loadData);
    };
  }, []);

  const handleRemoveFromPlan = (id: number) => {
    const updated = todayPlan.filter((item) => item.id !== id);
    setTodayPlan(updated);
    localStorage.setItem("todaysPlan", JSON.stringify(updated));
    window.dispatchEvent(new Event("fitlog-storage-update"));
  };

  const handleRemoveFromSaved = (id: number) => {
    const updated = savedExercises.filter((item) => item.id !== id);
    setSavedExercises(updated);
    localStorage.setItem("savedExercises", JSON.stringify(updated));
    window.dispatchEvent(new Event("fitlog-storage-update"));
  };

  const currentList = activeTab === "plan" ? todayPlan : savedExercises;

  const totalMinutes = todayPlan.reduce((acc, curr) => acc + curr.duration, 0);
  const totalCalories = todayPlan.reduce((acc, curr) => acc + curr.caloriesBurned, 0);

  return (
    <main className="min-h-screen bg-[#08090b] text-white px-4 py-8">
      <div className="mx-auto max-w-350 space-y-6">
        
       
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wide">MY PLAN</h1>
          <p className="text-[10px] text-[#73777d] mt-1">
            Cap of five lifts for today. Finish them, then load more.
          </p>
        </div>

      
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#101216] border border-[#1b1e22] rounded-xl p-6">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-[#73777d]">Exercises</span>
            <p className="text-3xl font-black text-[#d6ff38] mt-1">{todayPlan.length}</p>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-[#73777d]">Minutes</span>
            <p className="text-3xl font-black text-white mt-1">{totalMinutes}</p>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-[#73777d]">Calories</span>
            <p className="text-3xl font-black text-white mt-1">{totalCalories}</p>
          </div>
        </div>

       
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-[#1b1e22] pb-4">
          <div className="flex gap-2 bg-[#101216] p-1 rounded-lg border border-[#1b1e22]">
            <button
              onClick={() => router.push("/my-plane?tab=plan")}
              className={`px-4 py-2 rounded-md text-[9px] font-extrabold uppercase transition ${
                activeTab === "plan" ? "bg-[#1b1e22] text-white" : "text-[#73777d] hover:text-white"
              }`}
            >
              Today&apos;s Plan
            </button>
            <button
              onClick={() => router.push("/my-plane?tab=saved")}
              className={`px-4 py-2 rounded-md text-[9px] font-extrabold uppercase transition ${
                activeTab === "saved" ? "bg-[#1b1e22] text-white" : "text-[#73777d] hover:text-white"
              }`}
            >
              Saved
            </button>
          </div>

          <div className="flex items-center gap-2 text-[9px] text-[#73777d]">
            <span>Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#101216] border border-[#24272b] rounded-lg px-3 py-2 text-white font-bold outline-none"
            >
              <option value="Duration">Duration</option>
              <option value="Calories">Calories</option>
            </select>
          </div>
        </div>


        {currentList.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-[#24272b] rounded-2xl py-20 text-center bg-[#101216]/50">
            <h2 className="text-base font-bold text-[#ddd]">NOTHING HERE YET</h2>
            <p className="text-[11px] text-[#656a71] mt-2 mb-6">
              Browse the library and add a lift to get today moving.
            </p>
            <Link
              href="/#library"
              className="rounded-md bg-[#d6ff38] px-5 py-2.5 text-[9px] font-extrabold uppercase text-black transition hover:bg-[#c7ff33]"
            >
              Go to workouts
            </Link>
          </div>
        ) : (
          <div className="space-y-3.5">
            {currentList.map((exercise) => (
              <div
                key={exercise.id}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#101216] border border-[#1b1e22] rounded-xl p-4 transition hover:border-[#30343a]"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative h-16 w-24 shrink-0 rounded-lg overflow-hidden bg-[#17191d]">
                    <Image src={exercise.image} alt={exercise.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase text-white">{exercise.name}</h3>
                    <p className="text-[8px] text-[#73777d] mt-0.5">{exercise.equipment}</p>
                    <div className="flex items-center gap-3 text-[8px] text-[#858a91] mt-2">
                      <span>⏱ {exercise.duration} min</span>
                      <span>🔥 {exercise.caloriesBurned} kcal</span>
                      <span>★ {exercise.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  <Link
                    href={`/exercises/${exercise.id}`}
                    className="px-4 py-2 rounded-lg border border-[#24272b] text-[8px] font-extrabold uppercase text-[#a5a8ad] hover:text-white transition"
                  >
                    View Details
                  </Link>

                  {activeTab === "plan" ? (
                    <button
                      onClick={() => handleRemoveFromPlan(exercise.id)}
                      className="px-4 py-2 rounded-lg bg-[#d6ff38] text-black text-[8px] font-black uppercase tracking-wide hover:bg-[#c7ff33] transition"
                    >
                      ✓ Mark as Done
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRemoveFromSaved(exercise.id)}
                      className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-[8px] font-black uppercase tracking-wide hover:bg-red-500/20 transition"
                    >
                      Remove
                    </button>
                  )}

                  <button
                    onClick={() =>
                      activeTab === "plan"
                        ? handleRemoveFromPlan(exercise.id)
                        : handleRemoveFromSaved(exercise.id)
                    }
                    className="text-[#73777d] hover:text-red-400 p-2 text-xs transition"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}

export default function MyPlanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#08090b] text-white p-8">Loading...</div>}>
      <MyPlanContent />
    </Suspense>
  );
}