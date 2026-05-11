import { TopBar } from "@/components/os/TopBar";
import { Tabs } from "@/components/os/Tabs";
import { Rail } from "@/components/os/Rail";
import { StatusBar } from "@/components/os/StatusBar";
import { CommandPalette } from "@/components/os/CommandPalette";
import { AppHooks } from "@/components/achievements/AppHooks";
import { ToastQueue } from "@/components/achievements/ToastQueue";
import { getAllPosts } from "@/lib/blog";

export default async function OsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posts = await getAllPosts();
  const paletteBlogLinks = posts.map((p) => ({
    slug: p.slug,
    title: p.meta.title,
  }));

  return (
    <>
      <div
        className="relative z-10 grid h-screen overflow-hidden border-stroke bg-bg-2 lg:m-4 lg:h-[calc(100vh-32px)] lg:rounded-xl lg:border"
        style={{
          gridTemplateRows: "36px auto 1fr 26px",
          boxShadow: "var(--window-shadow)",
        }}
      >
        <TopBar />
        <Tabs />
        <div className="grid min-h-0 grid-cols-1 lg:grid-cols-[240px_1fr]">
          <Rail />
          <main
            className="scrollbar-themed overflow-auto"
            style={{ background: "var(--editor-grad)" }}
          >
            <div className="relative min-h-full px-4 py-5 sm:px-6 sm:py-6">
              {children}
            </div>
          </main>
        </div>
        <StatusBar />
      </div>
      <AppHooks />
      <CommandPalette posts={paletteBlogLinks} />
      <ToastQueue />
    </>
  );
}
