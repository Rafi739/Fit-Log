import Link from "next/link";
import Image from "next/image";
import banner from "@/assets/banner.png";

export default function Hero() {
  return (
    <section className="px-4 pt-7 pb-7">
      <div className="relative mx-auto flex min-h-63 w-full max-w-275 items-center overflow-hidden rounded-xl border border-[#24262c] bg-[#17181d] px-8">

        
        <div className="relative z-10 max-w-125">

          <p className="mb-3 text-[8px] font-bold tracking-wide text-[#b6ff00]">
            WORKOUT LIBRARY
          </p>

          <h1 className="max-w-110 text-[36px] font-black leading-[0.92] tracking-[-1.5px] text-white">
            TRAIN WITH INTENT. LOG
            <br />
            EVERY SET.
          </h1>

          <p className="mt-4 max-w-107.5 text-[10px] leading-[1.6] text-[#85868b]">
            FitLog is a dark, no-nonsense gym companion: pick a lift, lock it
            into today&apos;s plan, and watch the week&apos;s work add up.
          </p>

          <Link
            href="#library"
            className="mt-4 inline-flex rounded-md bg-[#b6ff00] px-4 py-2 text-[8px] font-extrabold uppercase text-black transition hover:bg-[#c7ff33]"
          >
            Browse Workouts →
          </Link>
        </div>

      
        <div className="absolute right-8 bottom-0 flex h-full w-70 items-end justify-center max-sm:hidden">
          <Image
            src={banner}
            alt="Workout"
            width={280}
            height={215}
            className="h-53.75 w-auto object-contain"
          />
        </div>

      </div>
    </section>
  );
}