import { Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AdminPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ADMIN_PASSWORD = "garvit";

export function AdminPasswordModal({
  open,
  onOpenChange,
  onSuccess,
}: AdminPasswordModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setError("");
      setPassword("");
      onSuccess();
      onOpenChange(false);
    } else {
      setError("Incorrect password. Access denied.");
    }
  };

  const handleClose = () => {
    setPassword("");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-sm border border-border/60 bg-popover shadow-large p-0"
        data-ocid="admin.dialog"
      >
        <div className="p-6">
          <DialogHeader className="items-center text-center gap-3 mb-5">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/25">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg font-display font-bold text-foreground">
                Admin Access
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                Enter the admin password to access the moderation panel.
              </DialogDescription>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="admin-password"
                className="text-sm font-semibold text-foreground"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  className="pl-10 bg-background/50 border-border/60 focus:border-primary/50 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground/40"
                  autoComplete="off"
                  data-ocid="admin.input"
                />
              </div>
              {error && (
                <p
                  className="text-xs text-destructive font-medium flex items-center gap-1.5"
                  data-ocid="admin.error_state"
                >
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
                  {error}
                </p>
              )}
            </div>

            <DialogFooter className="gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                className="flex-1 sm:flex-none border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted text-sm"
                data-ocid="admin.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 sm:flex-none bg-primary text-primary-foreground hover:bg-primary/90 btn-glow hover:shadow-glow-red-sm text-sm font-semibold transition-all"
                data-ocid="admin.submit_button"
              >
                Enter Panel
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
