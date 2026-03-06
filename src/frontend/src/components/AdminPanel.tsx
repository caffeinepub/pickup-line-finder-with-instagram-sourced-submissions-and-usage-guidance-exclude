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
    <div className="min-h-screen relative" data-ocid="admin.panel">
      {/* Authoritative dark background overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-secondary/40 via-primary/10 to-background pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-3xl">
        {/* Header row */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={onBack}
            className="gap-2 border-border hover:bg-muted shrink-0"
            data-ocid="admin.secondary_button"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Feed
          </Button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 border border-primary/30 shrink-0">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground leading-tight">
                  Admin Panel
                </h1>
                <p className="text-xs text-muted-foreground">
                  {isLoading
                    ? "Loading..."
                    : `${lines.length} line${lines.length !== 1 ? "s" : ""} awaiting review`}
                </p>
              </div>
            </div>
          </div>

          {!isLoading && lines.length > 0 && (
            <div className="flex h-7 min-w-7 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs font-bold px-2 shrink-0">
              {lines.length}
            </div>
          )}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="space-y-4" data-ocid="admin.loading_state">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border border-border/60 bg-card/80">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Skeleton className="h-9 w-24" />
                      <Skeleton className="h-9 w-20" />
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
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="admin.empty_state"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              All caught up!
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              No pending lines — all caught up! Check back later for new
              submissions.
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
                    <Card className="border border-border/70 bg-card/90 hover:border-primary/30 transition-colors shadow-sm">
                      <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          {/* Line text */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                                Pending Review
                              </span>
                            </div>
                            <p className="text-foreground text-sm leading-relaxed whitespace-pre-line font-medium">
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
                          <div className="flex gap-2 shrink-0 sm:flex-col lg:flex-row">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(line.id)}
                              disabled={isBusy}
                              className="flex-1 sm:flex-none gap-1.5 bg-green-600 hover:bg-green-700 text-white border-0"
                              data-ocid={`admin.approve_button.${ocidIndex}`}
                            >
                              {isApproving ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <CheckCircle className="h-3.5 w-3.5" />
                              )}
                              {isApproving ? "Approving…" : "Approve"}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(line.id)}
                              disabled={isBusy}
                              className="flex-1 sm:flex-none gap-1.5"
                              data-ocid={`admin.delete_button.${ocidIndex}`}
                            >
                              {isRejecting ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5" />
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
