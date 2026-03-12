import {
  Check,
  Copy,
  Flag,
  Instagram,
  Lightbulb,
  Loader2,
  MessageCircle,
  MessageCircleHeart,
  Send,
  X,
} from "lucide-react";
import { useState } from "react";
import type { PickupLine } from "../backend";
import {
  useComments,
  useLineWithGuide,
  useReportPickupLine,
  useSubmitComment,
} from "../hooks/useQueries";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";

interface PickupLineDetailProps {
  pickupLineId: bigint | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatRelativeTime(submittedAt: bigint): string {
  // submittedAt is in nanoseconds
  const ms = Number(submittedAt / BigInt(1_000_000));
  const diffMs = Date.now() - ms;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  return `${Math.floor(diffDay / 30)}mo ago`;
}

function CommentsSection({ pickupLineId }: { pickupLineId: bigint }) {
  const [commentText, setCommentText] = useState("");
  const [commentUsername, setCommentUsername] = useState("");
  const [submitError, setSubmitError] = useState("");

  const { data: comments = [], isLoading } = useComments(pickupLineId);
  const submitComment = useSubmitComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!commentText.trim()) {
      setSubmitError("Comment cannot be empty");
      return;
    }
    try {
      await submitComment.mutateAsync({
        lineId: pickupLineId,
        text: commentText.trim(),
        username: commentUsername.trim() || "Anonymous",
      });
      setCommentText("");
      // Keep username for convenience
    } catch {
      setSubmitError("Failed to post comment. Try again.");
    }
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border/40">
        <MessageCircle className="h-3.5 w-3.5 text-primary/70" />
        <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
          Comments
        </span>
        {comments.length > 0 && (
          <Badge
            variant="secondary"
            className="ml-auto text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary border-primary/20"
          >
            {comments.length}
          </Badge>
        )}
      </div>

      {/* Comment list */}
      <div className="divide-y divide-border/30">
        {isLoading ? (
          <div
            className="flex items-center justify-center py-8"
            data-ocid="feed.comments.loading_state"
          >
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : comments.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-8 text-center px-5"
            data-ocid="feed.comments.empty_state"
          >
            <p className="text-sm text-muted-foreground">
              No comments yet — be the first!
            </p>
          </div>
        ) : (
          comments.map((comment, i) => (
            <div
              key={Number(comment.id)}
              className="px-5 py-3"
              data-ocid={`feed.comment.item.${i + 1}`}
            >
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span className="text-xs font-semibold text-foreground">
                  @{comment.username}
                </span>
                <span className="text-[10px] text-muted-foreground/60 shrink-0">
                  {formatRelativeTime(comment.submittedAt)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {comment.text}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Add comment form */}
      <div className="border-t border-border/40 px-5 py-4">
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            type="text"
            placeholder="Your username (optional)"
            value={commentUsername}
            onChange={(e) => setCommentUsername(e.target.value)}
            className="h-8 text-xs bg-background/50 border-border/60 focus:border-primary/50 text-foreground placeholder:text-muted-foreground/40"
            maxLength={50}
            data-ocid="feed.comments.input"
          />
          <div className="flex gap-2">
            <Textarea
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => {
                setCommentText(e.target.value);
                setSubmitError("");
              }}
              className="min-h-[60px] text-xs bg-background/50 border-border/60 focus:border-primary/50 resize-none text-foreground placeholder:text-muted-foreground/40 flex-1"
              maxLength={500}
              data-ocid="feed.comments.textarea"
            />
          </div>
          {submitError && (
            <p
              className="text-xs text-destructive"
              data-ocid="feed.comments.error_state"
            >
              {submitError}
            </p>
          )}
          <Button
            type="submit"
            size="sm"
            disabled={submitComment.isPending || !commentText.trim()}
            className="gap-1.5 text-xs h-8 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
            data-ocid="feed.comments.submit_button"
          >
            {submitComment.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            Post Comment
          </Button>
        </form>
      </div>
    </div>
  );
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
                    {pickupLine.username
                      ? `Submitted by @${pickupLine.username} · `
                      : ""}
                    Usage guide included
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* The Line card */}
            <div className="rounded-xl border border-border/50 bg-card overflow-hidden mb-5">
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

            {/* Comments section */}
            <CommentsSection pickupLineId={pickupLine.id} />

            <Separator className="bg-border/40 my-4" />

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
