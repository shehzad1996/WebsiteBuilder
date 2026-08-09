import { BRAND } from "@/lib/brand";

export default function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-white/30 sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; {new Date().getFullYear()} {BRAND.name}. Built with AI speed,
          delivered by humans.
        </p>
        <a href={`mailto:${BRAND.contactEmail}`} className="hover:text-white/60">
          {BRAND.contactEmail}
        </a>
      </div>
    </footer>
  );
}
