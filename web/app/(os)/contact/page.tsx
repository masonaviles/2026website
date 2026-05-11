import {
  Calendar,
  Clock,
  Globe,
  Mail,
  MapPin,
} from "lucide-react";

import { profile } from "@/lib/profile";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata = {
  title: "~/contact · mason.os",
  description:
    "Drop a message — I read every one myself and usually reply within a day or two. Senior or staff/principal IC roles welcome.",
};

const GITHUB_URL = "https://github.com/masonaviles";
const LINKEDIN_URL = "https://linkedin.com/in/masonaviles";

export default function ContactPage() {
  return (
    <section className="flex flex-col gap-6 pb-8">
      <header>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">
          ~/contact — drop me a line
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Let&apos;s talk.</h1>
        <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-ink-soft">
          I read every message myself and usually reply within a day or two.
          Whether it&apos;s a role, a project, or just to nerd out about
          email engineering — write away.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-stroke bg-panel">
          <div className="border-b border-stroke px-5 py-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
              ~/contact — new message
            </span>
          </div>
          <ContactForm />
        </div>

        <aside className="flex flex-col gap-4">
          <Card title="Reach me directly">
            <DirectLink
              icon={Mail}
              label="email"
              value={profile.contactEmail}
              href={`mailto:${profile.contactEmail}`}
            />
            <DirectLink
              icon={GithubGlyph}
              label="github"
              value="@masonaviles"
              href={GITHUB_URL}
              external
            />
            <DirectLink
              icon={LinkedinGlyph}
              label="linkedin"
              value="/in/masonaviles"
              href={LINKEDIN_URL}
              external
            />
          </Card>

          <Card title="What I'm open to">
            <ul className="flex flex-col gap-2 text-[13px] leading-relaxed text-ink-soft">
              <Bullet>
                Senior or staff/principal IC roles — frontend-leaning is fine,
                fullstack is great, AI-product is exciting.
              </Bullet>
              <Bullet>
                Companies that care about craft (Apple-tier polish),
                accessibility, and shipping things real users see.
              </Bullet>
              <Bullet>Consulting on email infra, design systems, marketing-site perf.</Bullet>
            </ul>
          </Card>

          <Card title="Quick facts">
            <ul className="flex flex-col gap-2 font-mono text-[12px] text-ink-soft">
              <Fact icon={MapPin} label="location" value="Remote · Las Vegas, NV" />
              <Fact icon={Clock} label="timezone" value="PT · async-friendly" />
              <Fact icon={Calendar} label="response" value="usually within 1–2 days" />
              <Fact icon={Globe} label="domain" value="gitaddmason.dev" />
            </ul>
          </Card>
        </aside>
      </div>
    </section>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-stroke bg-panel">
      <div className="border-b border-stroke px-4 py-2.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-mute">
          {title}
        </span>
      </div>
      <div className="flex flex-col gap-2 px-4 py-3">{children}</div>
    </div>
  );
}

function DirectLink({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-center gap-3 rounded-lg border border-stroke bg-bg-2 px-3 py-2 transition-colors hover:border-accent"
    >
      <span className="grid h-7 w-7 place-items-center rounded-md border border-stroke text-ink-soft transition-colors group-hover:border-accent group-hover:text-accent">
        <Icon size={13} />
      </span>
      <span className="flex flex-1 flex-col">
        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-mute">
          {label}
        </span>
        <span className="font-mono text-[12px] text-ink transition-colors group-hover:text-accent">
          {value}
        </span>
      </span>
    </a>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-center gap-2.5">
      <span className="grid h-5 w-5 place-items-center text-ink-mute">
        <Icon size={11} />
      </span>
      <span className="min-w-[80px] text-ink-mute">{label}</span>
      <span className="text-ink">{value}</span>
    </li>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5">
      <span
        aria-hidden="true"
        className="mt-2 inline-block h-[3px] w-[3px] flex-shrink-0 rounded-full bg-accent"
      />
      <span>{children}</span>
    </li>
  );
}

function GithubGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.05c-3.34.73-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.74.08-.74 1.21.09 1.85 1.25 1.85 1.25 1.08 1.85 2.83 1.31 3.52 1 .11-.78.42-1.31.77-1.61-2.67-.31-5.47-1.34-5.47-5.97 0-1.32.47-2.4 1.24-3.25-.13-.31-.54-1.55.11-3.22 0 0 1.01-.32 3.3 1.24a11.4 11.4 0 0 1 6 0c2.29-1.56 3.3-1.24 3.3-1.24.66 1.67.25 2.91.12 3.22.78.85 1.24 1.93 1.24 3.25 0 4.65-2.81 5.66-5.49 5.96.43.37.81 1.1.81 2.21v3.27c0 .32.22.7.83.58A12 12 0 0 0 12 .5z" />
    </svg>
  );
}

function LinkedinGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v15H.22V8zM8.96 8h4.37v2.05h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.47 3.04 5.47 7v8.33h-4.56v-7.39c0-1.76-.03-4.03-2.46-4.03-2.46 0-2.84 1.92-2.84 3.9V23H8.96V8z" />
    </svg>
  );
}
