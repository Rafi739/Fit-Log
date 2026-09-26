
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

  const activeTab = tabQuery === "saved" ? "saved" : "plan";

  const [todayPlan, setTodayPlan] = useState<Exercise[]>([]);
  const [savedExercises, setSavedExercises] = useState<Exercise[]>([]);

  const [sortBy, setSortBy] = useState("Duration");

  
  const [toast, setToast] = useState("");

  const loadData = () => {
    try {
      const plan = JSON.parse(
        localStorage.getItem("todaysPlan") || "[]"
      );

      const saved = JSON.parse(
        localStorage.getItem("savedExercises") || "[]"
      );

      setTodayPlan(Array.isArray(plan) ? plan : []);
      setSavedExercises(Array.isArray(saved) ? saved : []);
    } catch (error) {
      console.error("Failed to load storage data", error);
    }
  };

  useEffect(() => {
    const initialLoad = window.setTimeout(loadData, 0);

    window.addEventListener("fitlog-storage-update", loadData);
    window.addEventListener("storage", loadData);

    return () => {
      window.clearTimeout(initialLoad);
      window.removeEventListener(
        "fitlog-storage-update",
        loadData
      );
      window.removeEventListener("storage", loadData);
    };
  }, []);


  const showToast = (message: string) => {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 2500);
  };

 
  const handleRemoveFromPlan = (id: number) => {
    const updated = todayPlan.filter(
      (item) => item.id !== id
    );

    setTodayPlan(updated);

    localStorage.setItem(
      "todaysPlan",
      JSON.stringify(updated)
    );

    window.dispatchEvent(
      new Event("fitlog-storage-update")
    );
  };

  const handleRemoveFromSaved = (id: number) => {
    const updated = savedExercises.filter(
      (item) => item.id !== id
    );

    setSavedExercises(updated);

    localStorage.setItem(
      "savedExercises",
      JSON.stringify(updated)
    );

    window.dispatchEvent(
      new Event("fitlog-storage-update")
    );
  };

 
  const handleMarkAsDone = (id: number) => {
    handleRemoveFromPlan(id);
    showToast("Workout completed");
  };

 
  const handleXRemove = (id: number) => {
    if (activeTab === "plan") {
      handleRemoveFromPlan(id);
      showToast("Removed from today's plan");
    } else {
      handleRemoveFromSaved(id);
      showToast("Removed from saved");
    }
  };

  const currentList =
    activeTab === "plan"
      ? todayPlan
      : savedExercises;

 
  const sortedList = [...currentList].sort((a, b) => {
    if (sortBy === "Duration") {
      return a.duration - b.duration;
    }

    if (sortBy === "Calories") {
      return b.caloriesBurned - a.caloriesBurned;
    }

    if (sortBy === "Rating") {
      return b.rating - a.rating;
    }

    return 0;
  });


  const totalMinutes = todayPlan.reduce(
    (acc, curr) => acc + curr.duration,
    0
  );

  const totalCalories = todayPlan.reduce(
    (acc, curr) => acc + curr.caloriesBurned,
    0
  );

  return (
    <main className="min-h-screen bg-[#08090b] px-4 py-8 text-white">
      <div className="mx-auto max-w-275 space-y-6">

        
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wide">
            MY PLAN
          </h1>

          <p className="mt-1 text-[10px] text-[#73777d]">
            Cap of five lifts for today. Finish them, then load more.
          </p>
        </div>

      
        <div className="grid grid-cols-1 gap-4 rounded-xl border border-[#1b1e22] bg-[#101216] p-6 sm:grid-cols-3">

          <div>
            <span className="text-[9px] uppercase tracking-wider text-[#73777d]">
              Exercises
            </span>

            <p className="mt-1 text-3xl font-black text-[#d6ff38]">
              {todayPlan.length}
            </p>
          </div>

          <div>
            <span className="text-[9px] uppercase tracking-wider text-[#73777d]">
              Minutes
            </span>

            <p className="mt-1 text-3xl font-black text-white">
              {totalMinutes}
            </p>
          </div>

          <div>
            <span className="text-[9px] uppercase tracking-wider text-[#73777d]">
              Calories
            </span>

            <p className="mt-1 text-3xl font-black text-white">
              {totalCalories}
            </p>
          </div>

        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-b border-[#1b1e22] pb-4 sm:flex-row">

         
          <div className="flex gap-2 rounded-lg border border-[#1b1e22] bg-[#101216] p-1">

            <button
              onClick={() => router.replace("?tab=plan")}
              className={`rounded-md px-4 py-2 text-[9px] font-extrabold uppercase transition ${
                activeTab === "plan"
                  ? "bg-[#1b1e22] text-white"
                  : "text-[#73777d] hover:text-white"
              }`}
            >
              Today&apos;s Plan
            </button>

            <button
              onClick={() => router.replace("?tab=saved")}
              className={`rounded-md px-4 py-2 text-[9px] font-extrabold uppercase transition ${
                activeTab === "saved"
                  ? "bg-[#1b1e22] text-white"
                  : "text-[#73777d] hover:text-white"
              }`}
            >
              Saved
            </button>

          </div>

         
          <div className="flex items-center gap-2 text-[9px] text-[#73777d]">

            <span>Sort By</span>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none rounded-lg border border-[#24272b] bg-[#101216] py-2 pl-3 pr-8 text-[9px] font-bold text-white outline-none transition hover:border-[#3a3f46] focus:border-[#d6ff38]"
              >
                <option value="Duration"> Duration </option>

                <option value="Calories"> Calories </option>

                <option value="Rating"> Rating </option>
              </select>

              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-[#858a91]">
                ▼
              </span>
            </div>

          </div>
        </div>

      
        {sortedList.length === 0 ? (

          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#24272b] bg-[#101216]/50 py-20 text-center">

            <h2 className="text-base font-bold text-[#ddd]">
              NOTHING HERE YET
            </h2>

            <p className="mb-6 mt-2 text-[11px] text-[#656a71]">
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

            {sortedList.map((exercise) => (

              <div
                key={exercise.id}
                className="flex flex-col items-center justify-between gap-4 rounded-xl border border-[#1b1e22] bg-[#101216] p-4 transition hover:border-[#30343a] sm:flex-row"
              >

            
                <div className="flex w-full items-center gap-4 sm:w-auto">

                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-[#17191d]">

                    <Image
                      src={exercise.image}
                      alt={exercise.name}
                      fill
                      className="object-cover"
                    />

                  </div>

                  <div>

                    <h3 className="text-xs font-black uppercase text-white">
                      {exercise.name}
                    </h3>

                    <p className="mt-0.5 text-[8px] text-[#73777d]">
                      {exercise.equipment}
                    </p>

                    <div className="mt-2 flex items-center gap-3 text-[8px] text-[#858a91]">

                      <span>
                        ⏱ {exercise.duration} min
                      </span>

                      <span>
                        🔥 {exercise.caloriesBurned} kcal
                      </span>

                      <span>
                        ★ {exercise.rating}
                      </span>

                    </div>

                  </div>

                </div>

                
                <div className="flex w-full items-center justify-end gap-2.5 sm:w-auto">

                 
                  <Link
                    href={`/exercises/${exercise.id}`}
                    className="rounded-lg border border-[#24272b] px-4 py-2 text-[8px] font-extrabold uppercase text-[#a5a8ad] transition hover:text-white"
                  >
                    View Details
                  </Link>

               
                  {activeTab === "plan" ? (

                    <button
                      onClick={() =>
                        handleMarkAsDone(exercise.id)
                      }
                      className="rounded-lg bg-[#d6ff38] px-4 py-2 text-[8px] font-black uppercase tracking-wide text-black transition hover:bg-[#c7ff33]"
                    >
                      ✓ Mark as Done
                    </button>

                  ) : (

                    <button
                      onClick={() => {
                        handleRemoveFromSaved(exercise.id);
                        showToast("Removed from saved");
                      }}
                      className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-[8px] font-black uppercase tracking-wide text-red-400 transition hover:bg-red-500/20"
                    >
                      Remove
                    </button>

                  )}

                
                  <button
                    onClick={() =>
                      handleXRemove(exercise.id)
                    }
                    className="p-2 text-xs text-[#73777d] transition hover:text-red-400"
                    aria-label="Remove exercise"
                  >
                    ✕
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

  
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] rounded-lg border border-[#2a2d32] bg-[#101216] px-4 py-3 shadow-xl">

          <div className="flex items-center gap-2">

            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#d6ff38] text-[10px] font-black text-black">
              ✓
            </span>

            <span className="text-[10px] font-bold text-white">
              {toast}
            </span>

          </div>

        </div>
      )}

    </main>
  );
}

export default function MyPlanPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#08090b] p-8 text-white">
          Loading...
        </div>
      }
    >
      <MyPlanContent />
    </Suspense>
  );
}

