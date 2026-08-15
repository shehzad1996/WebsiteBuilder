import { notFound, redirect } from "next/navigation";
import { getInquiryBySlug } from "@/lib/inquiries";
import { BRAND } from "@/lib/brand";

const STATUS_COPY: Record<string, string> = {
  new: "Your developer is putting together a first look at this.",
  quoted: "Your developer is finishing the real build.",
  building: "Your developer is finishing the real build.",
  delivered: "This is the finished site.",
};

export default async function PreviewPage({ params }: { params: { slug: string } }) {
  const inquiry = await getInquiryBySlug(params.slug).catch(() => null);

  if (!inquiry) {
    notFound();
  }

  // A human has swapped in the real, hand-built site — send visitors there.
  if (inquiry.previewUrl) {
    redirect(inquiry.previewUrl);
  }

  const heading = inquiry.projectName || `${inquiry.name}'s website`;
  const statusLine = STATUS_COPY[inquiry.status] ?? STATUS_COPY.new;

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-2xl border border-brand/30 bg-brand/10 px-4 py-2 text-center text-xs font-medium text-brand-light">
        Auto-generated from your brief — {statusLine}
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-night-soft/50">
        <div className="border-b border-white/10 px-8 py-10 text-center">
          <span className="text-xs font-medium uppercase tracking-widest text-brand-light">
            {inquiry.projectType}
          </span>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{heading}</h1>
        </div>

        <div className="px-8 py-10">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-white/40">
            What you told us
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-white/70">{inquiry.description}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-night p-4">
              <p className="text-xs text-white/40">Budget</p>
              <p className="mt-1 text-sm font-medium text-white">{inquiry.budget}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-night p-4">
              <p className="text-xs text-white/40">Timeline</p>
              <p className="mt-1 text-sm font-medium text-white">{inquiry.timeline}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-white/50">
          This page updates automatically once your developer publishes the real, working site
          at this same link — nothing to refresh or re-request.
        </p>
        <p className="mt-3 text-sm text-white/30">
          Questions in the meantime?{" "}
          <a href={`mailto:${BRAND.contactEmail}`} className="text-brand-light hover:underline">
            {BRAND.contactEmail}
          </a>
        </p>
      </div>
    </section>
  );
}
