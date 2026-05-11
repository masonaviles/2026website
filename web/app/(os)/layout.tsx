import { TopBar } from "@/components/os/TopBar";
import { Tabs } from "@/components/os/Tabs";
import { Rail } from "@/components/os/Rail";
import { StatusBar } from "@/components/os/StatusBar";
import { CommandPalette } from "@/components/os/CommandPalette";

export default function OsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div
        className="relative z-10 m-4 grid h-[calc(100vh-32px)] overflow-hidden rounded-xl border border-stroke bg-bg-2"
        style={{
          gridTemplateRows: "36px auto 1fr 26px",
          boxShadow: "var(--window-shadow)",
        }}
      >
        <TopBar />
        <Tabs />
        <div className="grid min-h-0" style={{ gridTemplateColumns: "240px 1fr" }}>
          <Rail />
          <main
            className="scrollbar-themed overflow-auto"
            style={{ background: "var(--editor-grad)" }}
          >
            <div className="relative min-h-full px-6 py-6">{children}</div>
          </main>
        </div>
        <StatusBar />
      </div>
      <CommandPalette />
    </>
  );
}
