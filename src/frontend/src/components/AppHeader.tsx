import { Heart, Plus, ShieldCheck, Sparkles } from "lucide-react";
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
  const [logoError, setLogoError] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const { data: pendingLines } = usePendingPickupLines();
  const pendingCount = pendingLines?.length ?? 0;

  return (
    <>
      <header className="border-b border-primary/20 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!logoError ? (
                <img
                  src="/assets/generated/rizzassist-logo.dim_512x256.png"
                  alt="RizzAssist"
                  className="h-12 w-auto smooth-render"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  RizzAssist
                </div>
              )}
            </div>

            <nav className="flex items-center gap-2">
              <Button
                variant={currentView === "feed" ? "default" : "ghost"}
                onClick={() => onViewChange("feed")}
                className="gap-2 font-medium"
                size="default"
                data-ocid="nav.feed.link"
              >
                <Heart className="h-4 w-4" />
                Browse
              </Button>

              <Button
                variant="ghost"
                onClick={onRandomClick}
                disabled={!hasPickupLines}
                className="gap-2 font-medium"
                size="default"
              >
                <Sparkles className="h-4 w-4" />
                Random
              </Button>

              <Button
                variant={currentView === "submit" ? "default" : "outline"}
                onClick={() => onViewChange("submit")}
                className="gap-2 font-medium"
                size="default"
                data-ocid="nav.submit.link"
              >
                <Plus className="h-4 w-4" />
                Submit
              </Button>

              <Button
                variant={currentView === "admin" ? "default" : "ghost"}
                onClick={() => setAdminModalOpen(true)}
                className="gap-2 font-medium relative"
                size="default"
                data-ocid="admin.open_modal_button"
              >
                <ShieldCheck className="h-4 w-4" />
                Admin
                {pendingCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 text-[10px] font-bold flex items-center justify-center rounded-full pointer-events-none"
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
