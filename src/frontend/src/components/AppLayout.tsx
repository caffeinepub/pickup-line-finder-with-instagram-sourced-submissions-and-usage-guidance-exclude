import { AppHeader } from "./AppHeader";

interface AppLayoutProps {
  children: React.ReactNode;
  currentView: "feed" | "submit" | "admin";
  onViewChange: (view: "feed" | "submit" | "admin") => void;
  onRandomClick: () => void;
  hasPickupLines: boolean;
}

export function AppLayout({
  children,
  currentView,
  onViewChange,
  onRandomClick,
  hasPickupLines,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Ambient red glow — top center radial */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[520px] opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 0%, oklch(0.55 0.22 25 / 0.35) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Very subtle noise texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <AppHeader
          currentView={currentView}
          onViewChange={onViewChange}
          onRandomClick={onRandomClick}
          hasPickupLines={hasPickupLines}
        />

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border/60 bg-card/40 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold">
                  <span className="text-primary">RIZZ</span>
                  <span className="text-foreground">ASSIST</span>
                </span>
              </div>

              {/* Tagline */}
              <p className="text-sm text-muted-foreground text-center">
                Master the art of the rizz — one line at a time.
              </p>

              {/* Attribution */}
              <p className="text-xs text-muted-foreground/70">
                © {new Date().getFullYear()} · Built with ❤️ using{" "}
                <a
                  href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary/70 hover:text-primary transition-colors underline underline-offset-2"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
