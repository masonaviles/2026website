import { Mail, BookOpen } from "lucide-react";
import { profile, type IconKey } from "@/lib/profile";

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.05c-3.34.73-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.74.08-.74 1.21.09 1.85 1.25 1.85 1.25 1.08 1.85 2.83 1.31 3.52 1 .11-.78.42-1.31.77-1.61-2.67-.31-5.47-1.34-5.47-5.97 0-1.32.47-2.4 1.24-3.25-.13-.31-.54-1.55.11-3.22 0 0 1.01-.32 3.3 1.24a11.4 11.4 0 0 1 6 0c2.29-1.56 3.3-1.24 3.3-1.24.66 1.67.25 2.91.12 3.22.78.85 1.24 1.93 1.24 3.25 0 4.65-2.81 5.66-5.49 5.96.43.37.81 1.1.81 2.21v3.27c0 .32.22.7.83.58A12 12 0 0 0 12 .5z" />
    </svg>
  );
}

function LinkedinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v15H.22V8zM8.96 8h4.37v2.05h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.47 3.04 5.47 7v8.33h-4.56v-7.39c0-1.76-.03-4.03-2.46-4.03-2.46 0-2.84 1.92-2.84 3.9V23H8.96V8z" />
    </svg>
  );
}

const ICON_MAP: Record<IconKey, React.ComponentType<{ size?: number }>> = {
  github: GithubIcon,
  email: Mail,
  blog: BookOpen,
  linkedin: LinkedinIcon,
};

export function IconLinks() {
  return (
    <div className="flex gap-2" aria-label="Profile links">
      {profile.icons.map((icon) => {
        const Icon = ICON_MAP[icon.key];
        return (
          <a
            key={icon.key}
            href={icon.href}
            target={icon.external ? "_blank" : undefined}
            rel={icon.external ? "noopener noreferrer" : undefined}
            title={icon.label}
            aria-label={icon.label}
            className="inline-grid h-9 w-9 place-items-center rounded-lg border border-stroke bg-panel text-ink-soft transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
          >
            <Icon size={16} />
          </a>
        );
      })}
    </div>
  );
}
