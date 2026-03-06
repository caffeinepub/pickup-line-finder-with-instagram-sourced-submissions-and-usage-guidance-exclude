import { Dices, Plus, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { usePendingPickupLines } from "../hooks/useQueries";
import { AdminPasswordModal } from "./AdminPasswordModal";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface AppHeaderProps {
  currentView: "feed" | "submit" | "admin";
  onViewChange: (view: "feed" | "submit" | "admin") => void;
  onRandomClick: () => void;
  hasPickupLines: boolean;
}

export function AppHeader({
  currentView,
  onViewChange,
  onRandomClick,
  hasPickupLines,
}: AppHeaderProps) {
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const { data: pendingLines } = usePendingPickupLines();
  const pendingCount = pendingLines?.length ?? 0;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
        {/* Subtle top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              type="button"
              onClick={() => onViewChange("feed")}
              className="flex items-center gap-2 group shrink-0"
              aria-label="Go to feed"
            >
              {/* Logo mark — stylized R with red accent */}
              <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/30 group-hover:bg-primary/20 transition-colors">
                <span className="font-display font-black text-primary text-lg leading-none">
                  R
                </span>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
              </div>

              {/* Wordmark */}
              <div className="font-display font-bold text-xl tracking-tight leading-none">
                <span className="text-primary">RIZZ</span>
                <span className="text-foreground">ASSIST</span>
              </div>
            </button>

            {/* Navigation */}
            <nav className="flex items-center gap-1.5">
              <Button
                variant={currentView === "feed" ? "default" : "ghost"}
                onClick={() => onViewChange("feed")}
                className={`gap-2 font-medium text-sm h-9 px-4 transition-all ${
                  currentView === "feed"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-red-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                data-ocid="nav.feed.link"
              >
                Browse
              </Button>

              <Button
                variant="ghost"
                onClick={onRandomClick}
                disabled={!hasPickupLines}
                className="gap-2 font-medium text-sm h-9 px-3 text-muted-foreground hover:text-foreground hover:bg-muted transition-all disabled:opacity-30"
                title="Random line"
              >
                <Dices className="h-4 w-4" />
                <span className="hidden sm:inline">Random</span>
              </Button>

              <Button
                variant={currentView === "submit" ? "default" : "outline"}
                onClick={() => onViewChange("submit")}
                className={`gap-2 font-medium text-sm h-9 px-4 transition-all ${
                  currentView === "submit"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-red-sm"
                    : "border-border/60 text-foreground hover:bg-muted hover:border-primary/40 btn-glow"
                }`}
                data-ocid="nav.submit.link"
              >
                <Plus className="h-4 w-4" />
                <span>Submit</span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => setAdminModalOpen(true)}
                className="gap-2 font-medium text-sm h-9 px-3 text-muted-foreground hover:text-foreground hover:bg-muted transition-all relative"
                data-ocid="admin.open_modal_button"
              >
                <ShieldCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
                {pendingCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[9px] font-bold flex items-center justify-center rounded-full pointer-events-none animate-pulse-glow"
                  >
                    {pendingCount > 99 ? "99+" : pendingCount}
                  </Badge>
                )}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <AdminPasswordModal
        open={adminModalOpen}
        onOpenChange={setAdminModalOpen}
        onSuccess={() => onViewChange("admin")}
      />
    </>
  );
}
