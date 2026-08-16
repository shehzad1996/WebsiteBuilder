import { BRAND } from "@/lib/brand";

export default function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto max-w-6xl px-6 py-10 text-center text-sm text-white/30">
        <p>
          &copy; {new Date().getFullYear()} {BRAND.name}. Built by real
          developers.
        </p>
      </div>
    </footer>
  );
}
