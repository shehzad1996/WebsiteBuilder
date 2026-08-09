type PricingCardProps = {
  title: string;
  price: string;
  cadence?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
};

export default function PricingCard({
  title,
  price,
  cadence,
  description,
  features,
  highlighted = false,
}: PricingCardProps) {
  return (
    <div
      className={`flex flex-col rounded-2xl border p-8 ${
        highlighted
          ? "border-brand/50 bg-night-soft shadow-[0_0_0_1px_rgba(255,90,31,0.15),0_20px_60px_-15px_rgba(255,90,31,0.3)]"
          : "border-white/10 bg-night-soft/60"
      }`}
    >
      {highlighted && (
        <span className="mb-4 inline-block w-fit rounded-full border border-brand/40 bg-brand/15 px-3 py-1 text-xs font-medium text-brand-light">
          Most popular
        </span>
      )}
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className={`mt-2 text-3xl font-bold ${highlighted ? "text-brand-light" : "text-white"}`}>
        {price}
        {cadence && <span className="ml-1 text-base font-normal text-white/40">{cadence}</span>}
      </p>
      <p className="mt-3 text-sm text-white/50">{description}</p>
      <ul className="mt-6 flex-1 space-y-3 text-sm">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span className={highlighted ? "text-brand-light" : "text-white/30"}>&#10003;</span>
            <span className="text-white/70">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
