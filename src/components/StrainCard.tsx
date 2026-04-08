import { Link } from "@/i18n/navigation";
import { Strain } from "@/types";
import { IconStar, IconDna } from "./icons";

// Generate a unique abstract gradient based on strain color
function strainGradient(color: string, type: string): string {
  const typeAccents: Record<string, string> = {
    sativa: "#facc15",
    indica: "#a78bfa",
    hybrid: "#34d399",
  };
  const accent = typeAccents[type] || "#34d399";
  return `radial-gradient(ellipse at 20% 80%, ${color}60 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, ${accent}40 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, ${color}30 0%, transparent 70%),
          linear-gradient(135deg, ${color}15 0%, #131316 100%)`;
}

function strainGlow(color: string): string {
  return `0 0 20px ${color}25, 0 0 40px ${color}10, inset 0 1px 0 ${color}20`;
}

// Effect icons — universal, everyone understands these
const effectIcons: Record<string, string> = {
  Creative: "🎨",
  Happy: "😊",
  Relaxed: "😌",
  Uplifted: "🚀",
  Euphoria: "✨",
  Energetic: "⚡",
  Focused: "🎯",
  Hungry: "🍕",
  Sleepy: "😴",
  Talkative: "💬",
  Giggly: "😂",
  Tingly: "🌊",
  Aroused: "🔥",
  "Pain Relief": "💊",
  Calm: "🧘",
};

export default function StrainCard({ strain }: { strain: Strain }) {
  return (
    <Link href={`/strains/${strain.id}`}>
      <div
        className="rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-[1.02]"
        style={{
          background: strainGradient(strain.color, strain.type),
          boxShadow: strainGlow(strain.color),
          border: `1px solid ${strain.color}30`,
        }}
      >
        <div className="p-4 backdrop-blur-sm">
          {/* Top: Name + Rating */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-black text-lg text-white leading-tight tracking-tight uppercase">
                {strain.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`strain-${strain.type} px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-white`}
                >
                  {strain.type}
                </span>
                {strain.genetics && strain.genetics !== "Unknown" && (
                  <span className="text-white/60 text-[10px] flex items-center gap-0.5">
                    <IconDna className="w-3 h-3" />
                    {strain.genetics}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <IconStar
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= Math.round(strain.rating) ? "text-yellow-400" : "text-white/20"
                    }`}
                    filled={star <= Math.round(strain.rating)}
                  />
                ))}
              </div>
              <span className="text-white/60 text-[10px] mt-0.5">
                {strain.rating.toFixed(1)} ({strain.reviewCount.toLocaleString()})
              </span>
            </div>
          </div>

          {/* Effects */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {(strain.effects || []).slice(0, 3).map((effect) => (
              <span
                key={effect}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium text-white/90 backdrop-blur-md"
                style={{ backgroundColor: `${strain.color}35`, border: `1px solid ${strain.color}40` }}
              >
                <span className="text-xs">{effectIcons[effect] || "✨"}</span>
                {effect}
              </span>
            ))}
          </div>

          {/* THC bar + Flavors */}
          <div className="flex items-center gap-3">
            <div className="w-20 shrink-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/50 text-[9px] font-medium">THC</span>
                <span className="text-white/80 text-[10px] font-bold">{strain.thc}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(strain.thc / 35) * 100}%`,
                    background: `linear-gradient(90deg, ${strain.color}, ${strain.color}cc)`,
                  }}
                />
              </div>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex-1 min-w-0">
              <span className="text-white/40 text-[9px] font-medium">FLAVOR</span>
              <p className="text-white/70 text-[10px] truncate mt-0.5">
                {(strain.flavors || []).slice(0, 3).join(" · ")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
