import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Loader2,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import {
  useApprovePickupLine,
  usePendingPickupLines,
  useRejectPickupLine,
} from "../hooks/useQueries";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface AdminPanelProps {
  onBack: () => void;
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const { data: pendingLines, isLoading } = usePendingPickupLines();
  const approveMutation = useApprovePickupLine();
  const rejectMutation = useRejectPickupLine();

  const handleApprove = async (id: bigint) => {
    try {
      await approveMutation.mutateAsync(id);
      toast.success("Line approved and published!");
    } catch {
      toast.error("Failed to approve line. Please try again.");
    }
  };

  const handleReject = async (id: bigint) => {
    try {
      await rejectMutation.mutateAsync(id);
      toast.success("Line rejected and removed.");
    } catch {
      toast.error("Failed to reject line. Please try again.");
    }
  };

  const lines = pendingLines ?? [];

  return (
    <div
      className="min-h-[calc(100vh-64px)] relative bg-background"
      data-ocid="admin.panel"
    >
      {/* Subtle top glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-20"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, oklch(0.55 0.22 25 / 0.4) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Button
            variant="outline"
            onClick={onBack}
            className="gap-2 border-border/60 text-foreground hover:bg-muted hover:border-border shrink-0 text-sm"
            data-ocid="admin.secondary_button"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex-1 min-w-0 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/25 shrink-0">
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground leading-tight">
                Admin Panel
              </h1>
              <p className="text-xs text-muted-foreground">
                {isLoading
                  ? "Loading submissions..."
                  : `${lines.length} line${lines.length !== 1 ? "s" : ""} awaiting review`}
              </p>
            </div>
          </div>

          {!isLoading && lines.length > 0 && (
            <div className="flex h-7 min-w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold px-2.5 shrink-0 animate-pulse-glow">
              {lines.length}
            </div>
          )}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="space-y-3" data-ocid="admin.loading_state">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border border-border/50 bg-card">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2.5">
                      <Skeleton className="h-3.5 w-3/4 animate-shimmer" />
                      <Skeleton className="h-3.5 w-1/2 animate-shimmer" />
                      <Skeleton className="h-3.5 w-2/3 animate-shimmer" />
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Skeleton className="h-8 w-24 animate-shimmer" />
                      <Skeleton className="h-8 w-20 animate-shimmer" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && lines.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="admin.empty_state"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground mb-2">
              All caught up!
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              No pending submissions right now. Check back later for new
              community lines.
            </p>
          </motion.div>
        )}

        {/* Pending lines list */}
        {!isLoading && lines.length > 0 && (
          <div className="space-y-3" data-ocid="admin.list">
            <AnimatePresence mode="popLayout">
              {lines.map((line, index) => {
                const ocidIndex = index + 1;
                const isApproving =
                  approveMutation.isPending &&
                  approveMutation.variables === line.id;
                const isRejecting =
                  rejectMutation.isPending &&
                  rejectMutation.variables === line.id;
                const isBusy = isApproving || isRejecting;

                return (
                  <motion.div
                    key={line.id.toString()}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40, scale: 0.95 }}
                    transition={{ duration: 0.28, delay: index * 0.04 }}
                    data-ocid={`admin.item.${ocidIndex}`}
                  >
                    <Card className="border border-border/50 bg-card hover:border-primary/25 transition-colors relative overflow-hidden">
                      {/* Left accent on hover */}
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary/0 hover:bg-primary/50 transition-colors" />
                      <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          {/* Line text */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2.5">
                              <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
                              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">
                                Pending Review
                              </span>
                            </div>
                            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line font-medium">
                              {line.text}
                            </p>
                            {line.instagramUrl && (
                              <p className="mt-2 text-xs text-muted-foreground truncate">
                                Source:{" "}
                                <a
                                  href={line.instagramUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  {line.instagramUrl}
                                </a>
                              </p>
                            )}
                          </div>

                          {/* Action buttons */}
                          <div className="flex gap-2 shrink-0">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(line.id)}
                              disabled={isBusy}
                              className="gap-1.5 bg-emerald-600/90 hover:bg-emerald-600 text-white border-0 text-xs h-8 font-medium transition-all"
                              data-ocid={`admin.confirm_button.${ocidIndex}`}
                            >
                              {isApproving ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <CheckCircle className="h-3 w-3" />
                              )}
                              {isApproving ? "Approving…" : "Approve"}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleReject(line.id)}
                              disabled={isBusy}
                              className="gap-1.5 bg-destructive/90 hover:bg-destructive text-destructive-foreground text-xs h-8 font-medium transition-all"
                              data-ocid={`admin.delete_button.${ocidIndex}`}
                            >
                              {isRejecting ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}
                              {isRejecting ? "Rejecting…" : "Reject"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
