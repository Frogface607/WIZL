import { Link } from "@/i18n/navigation";
import { CheckIn } from "@/types";
import { moods } from "@/data/strains";

function timeAgo(dateStr: string): string {
  const now = new Date("2026-04-01T16:00:00Z");
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function CheckinCard({ checkin }: { checkin: CheckIn }) {
  const mood = moods.find((m) => m.value === checkin.mood);

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent-purple/20 flex items-center justify-center text-sm">🔥</div>
          <div>
            <span className="text-sm font-semibold text-text-primary">{checkin.username}</span>
            <span className="text-text-muted text-xs ml-2">{timeAgo(checkin.createdAt)}</span>
          </div>
        </div>
        {mood && (
          <span className="text-xs bg-bg-primary px-2 py-1 rounded-full text-text-muted">
            {mood.emoji} {mood.label}
          </span>
        )}
      </div>
      <Link href={`/strains/${checkin.strainId}`}
        className="flex items-center gap-3 bg-bg-primary/50 rounded-xl p-3 mb-3 hover:bg-bg-primary transition-colors">
        <span className="text-2xl">{checkin.strain.image}</span>
        <div className="flex-1">
          <p className="font-semibold text-sm">{checkin.strain.name}</p>
          <span className={`strain-${checkin.strain.type} px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white`}>
            {checkin.strain.type}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: checkin.rating }).map((_, i) => (
            <span key={i} className="text-accent-green text-xs">🌿</span>
          ))}
        </div>
      </Link>
      <p className="text-sm text-text-secondary leading-relaxed">{checkin.review}</p>
    </div>
  );
}
