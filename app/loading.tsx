export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="h-7 w-48 animate-pulse rounded-md bg-bg-elev" />
      <div className="mt-3 h-4 w-80 animate-pulse rounded bg-bg-elev/70" />
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-bg-elev/60" />
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="h-64 animate-pulse rounded-xl bg-bg-elev/60" />
        <div className="h-64 animate-pulse rounded-xl bg-bg-elev/60" />
      </div>
    </div>
  );
}
