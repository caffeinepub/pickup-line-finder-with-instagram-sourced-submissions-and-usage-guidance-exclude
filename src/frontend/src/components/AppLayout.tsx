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
    <div className="min-h-screen relative overflow-hidden">
      {/* Vibrant layered background with theme token gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-secondary/30 to-accent/20" />
      <div
        className="fixed inset-0 opacity-[0.06] pattern-bg smooth-render"
        style={{
          backgroundImage:
            "url(/assets/generated/doodle-pattern.dim_2048x2048.png)",
          backgroundSize: "512px 512px",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="relative z-10">
        <AppHeader
          currentView={currentView}
          onViewChange={onViewChange}
          onRandomClick={onRandomClick}
          hasPickupLines={hasPickupLines}
        />

        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {children}
        </main>

        <footer className="mt-24 py-12 border-t border-primary/20 bg-white/50 backdrop-blur-sm relative">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground relative z-10">
            <p>
              © {new Date().getFullYear()} • Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
