import { BRAND } from "@/lib/brand";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; {new Date().getFullYear()} {BRAND.name}. Built with AI speed,
          delivered by humans.
        </p>
        <a href={`mailto:${BRAND.contactEmail}`} className="hover:text-slate-700">
          {BRAND.contactEmail}
        </a>
      </div>
    </footer>
  );
}
