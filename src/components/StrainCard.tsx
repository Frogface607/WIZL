import { Link } from "@/i18n/navigation";
import { Strain } from "@/types";

const typeEmoji: Record<string, string> = {
  sativa: "☀️",
  indica: "🌙",
  hybrid: "⚡",
};

export default function StrainCard({ strain }: { strain: Strain }) {
  return (
    <Link href={`/strains/${strain.id}`}>
      <div className="glass-card rounded-2xl overflow-hidden hover:bg-bg-card-hover transition-all cursor-pointer group">
        {/* Top color bar based on strain type */}
        <div className={`h-1 strain-${strain.type}`} />

        <div className="p-4">
          <div className="flex gap-4">
            {/* Emoji icon with glow */}
            <div className="relative flex-shrink-0">
              <div className="text-4xl w-14 h-14 flex items-center justify-center bg-bg-primary rounded-xl group-hover:scale-110 transition-transform">
                {strain.image}
              </div>
              {/* THC badge */}
              <div className="absolute -bottom-1 -right-1 bg-bg-card border border-border rounded-full px-1.5 py-0.5">
                <span className="text-[9px] font-bold text-accent-green">
                  {strain.thc}%
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-bold text-text-primary truncate text-[15px] leading-tight">
                    {strain.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className={`strain-${strain.type} px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white`}>
                      {typeEmoji[strain.type]} {strain.type}
                    </span>
                  </div>
                </div>

                {/* Rating pill */}
                <div className="flex items-center gap-1 bg-accent-green/10 border border-accent-green/20 px-2 py-1 rounded-lg">
                  <span className="text-accent-green font-black text-sm">
                    {strain.rating.toFixed(1)}
                  </span>
                  <span className="text-accent-green text-[10px]">★</span>
                </div>
              </div>

              {/* Flavors row */}
              <div className="flex flex-wrap gap-1 mt-2">
                {strain.flavors.slice(0, 3).map((flavor) => (
                  <span
                    key={flavor}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-bg-primary/80 text-text-muted border border-border/50"
                  >
                    {flavor}
                  </span>
                ))}
              </div>

              {/* Effects preview */}
              <div className="flex items-center gap-1.5 mt-2">
                {strain.effects.slice(0, 3).map((effect) => (
                  <span key={effect} className="text-[10px] text-accent-purple font-medium">
                    {effect}
                  </span>
                ))}
              </div>

              {/* Reviews count */}
              <p className="text-text-muted text-[11px] mt-1.5">
                {strain.reviewCount.toLocaleString()} reviews
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
