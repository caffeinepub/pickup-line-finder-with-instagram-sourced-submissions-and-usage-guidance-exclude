import {
  Check,
  Copy,
  Flag,
  Instagram,
  Lightbulb,
  Loader2,
  MessageCircleHeart,
  X,
} from "lucide-react";
import { useState } from "react";
import type { PickupLine } from "../backend";
import { useLineWithGuide, useReportPickupLine } from "../hooks/useQueries";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Separator } from "./ui/separator";

interface PickupLineDetailProps {
  pickupLineId: bigint | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PickupLineDetail({
  pickupLineId,
  isOpen,
  onClose,
}: PickupLineDetailProps) {
  const reportMutation = useReportPickupLine();
  const { data: lineData, isLoading } = useLineWithGuide(pickupLineId);
  const [copied, setCopied] = useState(false);

  const pickupLine = lineData?.pickupLine;
  const howToUse = lineData?.howToUse;

  const handleReport = () => {
    if (pickupLine && confirm("Report this pickup line as inappropriate?")) {
      reportMutation.mutate(pickupLine.id);
    }
  };

  const handleCopy = async () => {
    if (!pickupLine) return;
    try {
      await navigator.clipboard.writeText(pickupLine.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl max-h-[88vh] overflow-y-auto bg-popover border border-border/60 shadow-large p-0"
        data-ocid="feed.dialog"
      >
        {/* Custom close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-lg w-8 h-8 flex items-center justify-center bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
          aria-label="Close"
          data-ocid="feed.close_button"
        >
          <X className="h-4 w-4" />
        </button>

        {isLoading || !pickupLine ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              <p className="text-xs text-muted-foreground">Loading line...</p>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-0">
            {/* Header */}
            <DialogHeader className="mb-5">
              <div className="flex items-start gap-3 pr-10">
                <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageCircleHeart className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-display font-bold leading-snug text-foreground">
                    {pickupLine.text.split("\n")[0]}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                    Multi-line pickup line · Usage guide included
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* The Line card */}
            <div className="rounded-xl border border-border/50 bg-card overflow-hidden mb-5">
              {/* Card header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/40">
                <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
                  The Line
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className={`gap-2 text-xs h-7 px-3 transition-all ${
                    copied
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                  data-ocid="feed.card.copy_button.1"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </Button>
              </div>

              {/* Line text with red left border */}
              <div className="relative px-5 py-4">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary/60 rounded" />
                <p className="text-sm leading-[1.8] whitespace-pre-wrap font-medium text-foreground">
                  {pickupLine.text}
                </p>
              </div>
            </div>

            {/* How to Use */}
            {howToUse && (
              <div className="rounded-xl border border-border/50 bg-card overflow-hidden mb-5">
                <div className="flex items-center gap-2 px-5 py-3 border-b border-border/40">
                  <Lightbulb className="h-3.5 w-3.5 text-primary/70" />
                  <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
                    How to Use
                  </span>
                </div>
                <div className="px-5 py-4">
                  <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {howToUse}
                  </p>
                </div>
              </div>
            )}

            {/* Instagram link */}
            {pickupLine.instagramUrl && (
              <div className="flex items-center gap-3 px-1 mb-5">
                <Instagram className="h-4 w-4 text-muted-foreground shrink-0" />
                <a
                  href={pickupLine.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:text-primary/80 underline underline-offset-3 transition-colors truncate"
                >
                  View original on Instagram
                </a>
              </div>
            )}

            <Separator className="bg-border/40 mb-4" />

            {/* Footer actions */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                {Number(pickupLine.reportCount) > 0 && (
                  <Badge
                    variant="outline"
                    className="border-destructive/30 text-destructive text-xs"
                  >
                    {Number(pickupLine.reportCount)} report
                    {Number(pickupLine.reportCount) !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReport}
                disabled={reportMutation.isPending}
                className="gap-2 text-xs text-muted-foreground/60 hover:text-destructive hover:bg-destructive/5 transition-all h-7 px-3"
                data-ocid="feed.delete_button"
              >
                {reportMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Flag className="h-3.5 w-3.5" />
                )}
                Report
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
