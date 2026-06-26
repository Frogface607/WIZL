import Link from "next/link";
import { getRandomWisdom } from "@/lib/wizl-wisdoms";

export default function NotFound() {
  const wisdom = getRandomWisdom("lost");

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-bg-hero">
      <div className="text-center max-w-md">
        <div className="relative w-32 h-32 mx-auto mb-6 animate-float">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/wizl-book.png"
            alt="WIZL"
            className="w-full h-full object-contain"
          />
          {/* firefly */}
          <span
            className="absolute -top-2 right-4 w-1.5 h-1.5 rounded-full bg-accent-green animate-firefly"
            style={{ animationDelay: "0.3s" }}
          />
          <span
            className="absolute bottom-3 -left-3 w-1 h-1 rounded-full bg-accent-green animate-firefly"
            style={{ animationDelay: "1.1s" }}
          />
        </div>

        <h1 className="text-2xl font-bold text-text-primary mb-3">404</h1>

        <p className="text-text-secondary italic mb-8 leading-relaxed">
          {wisdom}
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-green text-white text-sm font-semibold hover:bg-accent-green/80 transition-colors"
        >
          Return to The Book
        </Link>
      </div>
    </main>
  );
}
