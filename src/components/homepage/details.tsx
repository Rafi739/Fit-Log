"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

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

type DetailsProps = {
  id: string;
};

export default function Details({ id }: DetailsProps) {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);

  const [addedToPlan, setAddedToPlan] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadExercise = async () => {
      try {
        const response = await fetch("/fitlog.json");

        if (!response.ok) {
          throw new Error("Failed to load exercises");
        }

        const data: Exercise[] = await response.json();

        const selectedExercise = data.find(
          (item) => item.id.toString() === id
        );

        setExercise(selectedExercise || null);

        if (selectedExercise) {
          const plan = JSON.parse(
            localStorage.getItem("todaysPlan") || "[]"
          );

          const savedExercises = JSON.parse(
            localStorage.getItem("savedExercises") || "[]"
          );

          setAddedToPlan(
            Array.isArray(plan) &&
              plan.some(
                (item: Exercise) =>
                  item.id === selectedExercise.id
              )
          );

          setSaved(
            Array.isArray(savedExercises) &&
              savedExercises.some(
                (item: Exercise) =>
                  item.id === selectedExercise.id
              )
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadExercise();
  }, [id]);

  const handleAddToPlan = () => {
    if (!exercise) return;

    try {
      const currentPlan: Exercise[] = JSON.parse(
        localStorage.getItem("todaysPlan") || "[]"
      );

      const alreadyAdded = currentPlan.some(
        (item) => item.id === exercise.id
      );

      if (!alreadyAdded) {
        const updatedPlan = [...currentPlan, exercise];

        localStorage.setItem(
          "todaysPlan",
          JSON.stringify(updatedPlan)
        );

        setAddedToPlan(true);

        window.dispatchEvent(
          new Event("fitlog-storage-update")
        );
      }
    } catch (error) {
      console.error("Plan save error:", error);
    }
  };

  const handleSave = () => {
    if (!exercise) return;

    try {
      const currentSaved: Exercise[] = JSON.parse(
        localStorage.getItem("savedExercises") || "[]"
      );

      const alreadySaved = currentSaved.some(
        (item) => item.id === exercise.id
      );

      if (!alreadySaved) {
        const updatedSaved = [...currentSaved, exercise];

        localStorage.setItem(
          "savedExercises",
          JSON.stringify(updatedSaved)
        );

        setSaved(true);

        window.dispatchEvent(
          new Event("fitlog-storage-update")
        );
      }
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#08090b] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-xs text-[#777c83]">
            Loading exercise...
          </p>
        </div>
      </main>
    );
  }

  if (!exercise) {
    return (
      <main className="min-h-screen bg-[#08090b] px-4 py-20 text-white">
        <div className="mx-auto max-w-151.25">
          <h1 className="text-2xl font-bold">
            Exercise not found
          </h1>

          <Link
            href="/"
            className="mt-5 inline-block rounded-md bg-[#d6ff38] px-4 py-2 text-xs font-bold text-black"
          >
            Back to Library
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08090b] text-white">

      <div className="mx-auto w-full max-w-151.25 px-3.5 py-6.5">

        
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-[290px_1fr] sm:gap-7">

          <div className="relative h-90.75 w-full overflow-hidden rounded-[7px] sm:h-90.75 sm:w-72.5">

            <Image
              src={exercise.image}
              alt={exercise.name}
              fill
              priority
              sizes="290px"
              className="object-cover"
            />

          </div>

          <div className="flex min-w-0 flex-col">

            <h1 className="text-[18px] font-black uppercase leading-[1.05] tracking-[-0.03em]">
              {exercise.name}
            </h1>

            <p className="mt-1.25 max-w-71.25 text-[8px] leading-[1.45] text-[#777c83]">
              {exercise.description}
            </p>

            <div className="mt-2 flex gap-1.25">
              {exercise.muscleGroups.map((muscle) => (
                <span
                  key={muscle}
                  className="rounded-sm bg-[#d6ff38] px-1.7 py-0.75 text-[7px] font-black uppercase leading-none text-black"
                >
                  {muscle}
                </span>
              ))}
            </div>

            <div className="mt-3 w-full overflow-hidden rounded-[7px] border border-[#1b1e22]">

              <InfoRow label="EQUIPMENT" value={exercise.equipment} />

              <InfoRow label="DIFFICULTY" value={exercise.difficulty} />

              <InfoRow label="SETS" value={exercise.sets} />

              <InfoRow label="REPS" value={exercise.reps} />

              <InfoRow label="DURATION" value={`${exercise.duration} min`} />

              <InfoRow label="CALORIES" value={`${exercise.caloriesBurned} kcal`} />

              <InfoRow label="RATING" value={exercise.rating} last />

            </div>

            <div className="mt-4.25">

              <h2 className="text-[8px] font-black uppercase tracking-[0.04em]">
                Instructions
              </h2>

              <div className="mt-1.75 space-y-1.25">

                {exercise.instructions.map(
                  (instruction, index) => (
                    <div key={index} className="flex gap-1.75" >
                      <span className="w-1.75 shrink-0 text-[7px] leading-normal text-[#6d7279]"> {index + 1}. </span>

                      <p className="text-[7px] leading-normal text-[#777c83]"> {instruction} </p>
                    </div>
                  )
                )}

              </div>
            </div>

            <div className="mt-auto flex gap-1.75 pt-3.75">

              <button
                onClick={handleAddToPlan}
                className={`flex h-5.5 items-center gap-1.25 rounded-[5px] px-2.5 text-[7px] font-black uppercase transition ${
                  addedToPlan
                    ? "bg-[#30342a] text-[#d6ff38]"
                    : "bg-[#d6ff38] text-black hover:bg-[#c7ef2d]"
                }`}
              >
                <span className="text-[8px]">
                  {addedToPlan ? "✓" : "▣"}
                </span>

                {addedToPlan
                  ? "Added to today's plan"
                  : "Add to today's plan"}
              </button>

              <button
                onClick={handleSave}
                className={`flex h-5.5 items-center gap-1.25 rounded-[5px] border px-2.5 text-[7px] font-black uppercase transition ${
                  saved
                    ? "border-[#d6ff38] text-[#d6ff38]"
                    : "border-[#30343a] text-[#9a9fa5] hover:border-[#555a61]"
                }`}
              >
                <span className="text-[8px]">
                  {saved ? "✓" : "♡"}
                </span>

                {saved ? "Saved" : "Save for later"}
              </button>

            </div>

          </div>
        </div>
      </div>
    </main>
  );
}


function InfoRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string | number;
  last?: boolean;
}) {
  return (
    <div
      className={`flex h-8 items-center justify-between bg-[#15181e] px-2.75 ${
        !last ? "border-b border-[#202329]" : ""
      }`}
    >
      <span className="text-[6px] font-bold uppercase tracking-[0.06em] text-[#555b63]">
        {label}
      </span>

      <strong className="text-[7px] font-medium text-[#c4c7ca]">
        {value}
      </strong>
    </div>
  );
}
