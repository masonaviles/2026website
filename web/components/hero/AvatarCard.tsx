import Image from "next/image";
import { profile } from "@/lib/profile";

/**
 * Mason's headshot — circular avatar. Expects /mason.jpg in public/
 * (square crop, face centered).
 */
export function AvatarCard() {
  return (
    <div className="relative mx-auto w-full max-w-[280px]">
      <div className="relative aspect-square overflow-hidden rounded-full border-2 border-stroke shadow-[0_10px_40px_-12px_rgba(0,0,0,0.35)]">
        <Image
          src="/mason.jpg"
          alt={`${profile.name} — headshot`}
          fill
          sizes="(max-width: 1100px) min(100vw, 280px), 280px"
          priority
          className="object-cover"
        />
      </div>

      {/* Status badge — Discord/Slack-style pill anchored to the avatar */}
      <span
        className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-full border border-stroke bg-panel px-2.5 py-1 font-mono text-[10px] text-accent shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]"
      >
        <span
          className="h-1.5 w-1.5 rounded-full bg-accent"
          style={{
            animation: "pulse 2s infinite",
            boxShadow: "0 0 8px var(--accent)",
          }}
          aria-hidden="true"
        />
        online
      </span>
    </div>
  );
}
