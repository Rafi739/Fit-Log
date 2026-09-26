export default function Footer() {
  return (
    <footer className="mx-auto flex max-w-350 flex-col gap-3 border-t border-[#1b1d20] px-4 py-5 text-[7px] font-semibold tracking-[0.08em] text-[#50545a] sm:flex-row sm:items-center sm:justify-between sm:px-7">
      <div className="flex items-center gap-1.5 text-[#858a91]">
        <span className="h-1.25 w-1.25 rounded-full bg-[#d6ff38]" />

        <span>FITLOG</span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <span>© 2026 FITLOG</span>
        <span>TRAIN SMART • MOVE BETTER</span>
      </div>
    </footer>
  );
}
