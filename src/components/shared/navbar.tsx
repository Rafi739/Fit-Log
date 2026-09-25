import Link from "next/link";

export default function Navbar() {
  return (
    <header className="h-[50px] w-full border-b border-[#1d1e22] bg-[#0b0c0f]">
      <div className="mx-auto flex h-full w-full items-center justify-between px-5">

       
        <Link href="/" className="flex items-center gap-2">
          
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className="h-[17px] w-[17px]"
            stroke="#b6ff00"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 5v14" />
            <path d="M18 5v14" />
            <path d="M3 8v8" />
            <path d="M21 8v8" />
            <path d="M6 12h12" />
          </svg>

          <span className="text-[11px] font-extrabold tracking-wide text-white">
            FITLOG
          </span>
        </Link>

      
        <nav className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1">
          <Link
            href="/workouts"
            className="rounded-full bg-[#1d2b08] px-3 py-[5px] text-[8px] font-medium text-[#b6ff00]"
          >
            Workouts
          </Link>

          <Link
            href="/my-plan"
            className="px-3 py-[5px] text-[8px] font-medium text-[#85868b] transition hover:text-white"
          >
            My Plan
          </Link>
        </nav>

        <div className="flex items-center gap-4">

        
          <Link
            href="/plan"
            className="flex items-center gap-1.5 text-[8px] text-[#85868b]"
          >
            <span>Plan</span>

            <span className="flex h-[12px] min-w-[12px] items-center justify-center rounded-full bg-[#b6ff00] px-1 text-[7px] font-bold text-black">
              0
            </span>
          </Link>

        
          <Link
            href="/saved"
            className="flex items-center gap-1.5 text-[8px] text-[#85868b]"
          >
            <span>Saved</span>

            <span className="text-[7px] text-[#85868b]">
              0
            </span>
          </Link>

        </div>
      </div>
    </header>
  );
}