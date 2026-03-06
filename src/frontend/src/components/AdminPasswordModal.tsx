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
        className="sm:max-w-md border border-primary/30 bg-card"
        data-ocid="admin.dialog"
      >
        <DialogHeader className="items-center text-center gap-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 border border-primary/30">
            <ShieldCheck className="h-7 w-7 text-primary" />
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            Admin Access
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter the admin password to access the moderation panel.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label
              htmlFor="admin-password"
              className="text-foreground font-medium"
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
                className="pl-9 border-border focus:border-primary"
                autoComplete="off"
                data-ocid="admin.password_input"
              />
            </div>
            {error && (
              <p
                className="text-sm text-destructive font-medium flex items-center gap-1.5"
                data-ocid="admin.error_state"
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-destructive" />
                {error}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 sm:flex-none border-border"
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 sm:flex-none bg-primary text-primary-foreground hover:bg-primary/90"
              data-ocid="admin.submit_button"
            >
              Enter Admin Panel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
