import { Header } from "./Header";
import { Footer } from "./Footer";
import { BottomNav } from "./BottomNav";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  // The self-contained SCORM package is a single-page player with no
  // route navigation, so the footer and bottom-nav (pure site links)
  // are omitted there — they'd hard-navigate to pruned routes.
  const scorm = process.env.NEXT_PUBLIC_SCORM === "1";
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main
        id="main"
        className="w-full flex-1 px-4 sm:px-6 lg:px-8 pb-20 md:pb-0"
      >
        {children}
      </main>
      {!scorm ? <Footer /> : null}
      {!scorm ? <BottomNav /> : null}
    </div>
  );
}
