"use client";

export function Spinner({ className = "" }) {
  return (
    <span
      className={`inline-block h-4 w-4 rounded-full border-2 border-[#775ADA] border-t-transparent animate-spin ${className}`}
      aria-hidden="true"
    />
  );
}

export function LoadingState({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-[#737373]">
      <Spinner className="h-6 w-6" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function ErrorState({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-lg border border-[#F4B4B4] bg-[#FFF5F5] px-4 py-3 text-sm text-[#B00020]">
      {message}
    </div>
  );
}

export function SkeletonRows({ count = 3 }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="h-16 rounded-xl bg-[#EDEDED] animate-pulse" />
      ))}
    </div>
  );
}
