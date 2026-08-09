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
      className={`flex flex-col rounded-xl border p-8 ${
        highlighted
          ? "border-brand bg-brand text-white shadow-2xl shadow-brand/30"
          : "border-night-border bg-night-soft"
      }`}
    >
      {highlighted && (
        <span className="mb-4 inline-block w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide">
          Most popular
        </span>
      )}
      <h3 className={`text-lg font-bold ${highlighted ? "text-white" : "text-white"}`}>
        {title}
      </h3>
      <p className={`mt-2 font-display text-3xl font-black ${highlighted ? "text-white" : "text-white"}`}>
        {price}
        {cadence && (
          <span className={`ml-1 text-base font-normal ${highlighted ? "text-white/70" : "text-white/40"}`}>
            {cadence}
          </span>
        )}
      </p>
      <p className={`mt-3 text-sm ${highlighted ? "text-white/85" : "text-white/50"}`}>
        {description}
      </p>
      <ul className="mt-6 flex-1 space-y-3 text-sm">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span className={highlighted ? "text-white" : "text-brand"}>&#10003;</span>
            <span className={highlighted ? "text-white/90" : "text-white/70"}>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
