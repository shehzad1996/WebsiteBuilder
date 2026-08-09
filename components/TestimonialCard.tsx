type TestimonialCardProps = {
  quote: string;
  name: string;
  role: string;
};

export default function TestimonialCard({ quote, name, role }: TestimonialCardProps) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-night-soft/50 p-6">
      <div className="flex gap-0.5 text-brand-light" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9L10 15l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8L10 1.5z" />
          </svg>
        ))}
      </div>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-white/70">&ldquo;{quote}&rdquo;</p>
      <div className="mt-6 flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/20 text-sm font-semibold text-brand-light">
          {initial}
        </span>
        <div>
          <p className="text-sm font-medium text-white">{name}</p>
          <p className="text-xs text-white/40">{role}</p>
        </div>
      </div>
    </div>
  );
}
