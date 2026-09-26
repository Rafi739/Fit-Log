"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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

const filters = [
  "All",
  "Chest",
  "Back",
  "Legs",
  "Arms",
  "Core",
  "Full Body",
];

export default function Library() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const response = await fetch("/fitlog.json");

        if (!response.ok) {
          throw new Error("Failed to load exercises");
        }

        const data: Exercise[] = await response.json();

        setExercises(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, []);

  const filteredExercises =
    activeFilter === "All"
      ? exercises
      : exercises.filter((exercise) =>
          exercise.muscleGroups.includes(activeFilter)
        );

  return (
    <main className="min-h-screen bg-[#08090b] text-white">

      <header className="border-b border-[#1b1d20] px-4 py-5 sm:px-7">
        <div className="mx-auto max-w-275 text-center">
          <h1 className="text-[17px] font-extrabold tracking-[0.16em]">
            THE LIBRARY
          </h1>

          <p className="mt-1.5 text-[10px] text-[#73777d]">
            Exercises with purpose, your way.
          </p>
        </div>
      </header>

   
      <section className="mx-auto max-w-275 px-4 pt-4 sm:px-7">
        <div className="flex flex-wrap gap-1.5">
          {filters.map((filter) => {
            const active = activeFilter === filter;

            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={` rounded-sm border px-3 py-1.5 text-[9px] font-bold transition-all duration-200
                  ${
                    active
                      ? "border-[#d6ff38] bg-[#d6ff38] text-black"
                      : "border-[#24272b] bg-[#101216] text-[#777c83] hover:border-[#3a3e44] hover:text-white"
                  }
                `}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </section>

   
      <section id="library"
  className="mx-auto max-w-275 px-4 pb-12 pt-4 sm:px-7">

        {loading ? (
          <div className="flex min-h-100 flex-col items-center justify-center">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#272a2f] border-t-[#d6ff38]" />

            <p className="mt-3 text-[11px] text-[#656a71]">
              Loading exercises...
            </p>
          </div>

        ) : filteredExercises.length === 0 ? (

          <div className="flex min-h-100 flex-col items-center justify-center">
            <h2 className="text-base font-bold text-[#ddd]">
              No exercises found
            </h2>

            <p className="mt-2 text-[11px] text-[#656a71]">
              Try another muscle group.
            </p>
          </div>

        ) : (

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
              />
            ))}
          </div>

        )}

      </section>
    </main>
  );
}

function ExerciseCard({
  exercise,
}: {
  exercise: Exercise;
}) {
  return (
    <Link
      href={`/exercises/${exercise.id}`}
      className="group block overflow-hidden rounded-lg border border-[#1b1e22] bg-[#101216] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#30343a]"
    >

    
      <div className="relative aspect-[1.72/1] overflow-hidden bg-[#17191d]">
        <Image
          src={exercise.image}
          alt={exercise.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.025]"
        />

        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/2 to-black/8" />
      </div>


      <div className="p-3">

     
        <div className="mb-2 flex flex-wrap items-center gap-1">

          <span
            className={` rounded-[3px] px-1.5 py-0.75 text-[7px] font-extrabold uppercase tracking-wide text-black
              ${
                exercise.difficulty === "Advanced"
                  ? "bg-[#ffcf36]"
                  : "bg-[#d6ff38]"
              }
            `}
          >
            {exercise.difficulty}
          </span>

          {exercise.muscleGroups.map((muscle) => (
            <span
              key={muscle}
              className="rounded-[3px] border border-[#272a2f] bg-[#191c20] px-1.5 py-0.75 text-[7px] font-bold uppercase tracking-wide text-[#a5a8ad]"
            >
              {muscle}
            </span>
          ))}

        </div>

       
        <h2 className="text-xs font-extrabold uppercase leading-tight tracking-wide text-[#f4f4f4]"> {exercise.name} </h2>

        
        <p className="mt-1.5 line-clamp-2 text-[8.5px] leading-[1.55] text-[#686d74]"> {exercise.description} </p>

      
        <div className="mt-2.5 flex items-center gap-3 border-b border-[#1d2024] pb-2.5">

          <MetaItem icon="◷" value={`${exercise.duration} min`} />

          <MetaItem icon="🔥" value={`${exercise.caloriesBurned} kcal`} />

          <MetaItem icon="★" value={exercise.rating.toString()} />

        </div>

        <div className="grid grid-cols-[0.6fr_0.7fr_1.7fr] gap-2 pt-2.5">

          <Detail label="SETS" value={exercise.sets} />

          <Detail label="REPS" value={exercise.reps} />

          <Detail label="EQUIPMENT" value={exercise.equipment} />

        </div>

      </div>
    </Link>
  );
}

function MetaItem({
  icon,
  value,
}: {
  icon: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1 whitespace-nowrap text-[7.5px] text-[#777c83]">
      <span className="text-[8px] text-[#b3b7bc]">
        {icon}
      </span>

      <span>{value}</span>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="min-w-0">
      <span className="mb-1 block text-[6px] font-bold tracking-[0.08em] text-[#4e535a]">
        {label}
      </span>

      <strong className="block truncate text-[7.5px] font-semibold text-[#aeb2b7]">
        {value}
      </strong>
    </div>
  );
}