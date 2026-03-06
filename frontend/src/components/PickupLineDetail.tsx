import { X, MessageCircleHeart, Instagram, Flag, Lightbulb, Copy, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useReportPickupLine, useLineWithGuide } from '../hooks/useQueries';
import type { PickupLine } from '../backend';

interface PickupLineDetailProps {
  pickupLineId: bigint | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PickupLineDetail({ pickupLineId, isOpen, onClose }: PickupLineDetailProps) {
  const reportMutation = useReportPickupLine();
  const { data: lineData, isLoading } = useLineWithGuide(pickupLineId);
  const [copied, setCopied] = useState(false);

  const pickupLine = lineData?.pickupLine;
  const howToUse = lineData?.howToUse;

  const handleReport = () => {
    if (pickupLine && confirm('Report this pickup line as inappropriate?')) {
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
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-2 border-primary/30 shadow-large">
        {isLoading || !pickupLine ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <DialogTitle className="text-2xl leading-tight pr-8">
                    {pickupLine.text.split('\n')[0]}
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    Multi-line pickup line with usage guide
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 pt-4">
              {/* Main pickup line with theme token gradient background */}
              <div className="relative bg-gradient-to-br from-primary/20 via-secondary/30 to-accent/20 rounded-2xl p-6 border-2 border-primary/30 shadow-medium overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MessageCircleHeart className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">The Line</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="gap-2 hover:bg-white/50"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-base leading-relaxed whitespace-pre-wrap font-medium">
                    {pickupLine.text}
                  </p>
                </div>
              </div>

              <Separator className="bg-primary/20" />

              {/* Usage guide with theme token gradient highlights */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-accent" />
                  <h3 className="font-semibold text-lg">How to Use</h3>
                </div>
                <div className="bg-gradient-to-br from-accent/10 to-secondary/10 rounded-xl p-5 border-2 border-accent/20">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {howToUse}
                  </p>
                </div>
              </div>

              {/* Instagram link if available */}
              {pickupLine.instagramUrl && (
                <>
                  <Separator className="bg-primary/20" />
                  <div className="flex items-center gap-3">
                    <Instagram className="h-5 w-5 text-primary" />
                    <a
                      href={pickupLine.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-primary/80 underline underline-offset-4 transition-colors font-medium"
                    >
                      View on Instagram
                    </a>
                  </div>
                </>
              )}

              <Separator className="bg-primary/20" />

              {/* Footer actions */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  {Number(pickupLine.reportCount) > 0 && (
                    <Badge variant="outline" className="border-destructive/30 text-destructive">
                      {Number(pickupLine.reportCount)} report{Number(pickupLine.reportCount) !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReport}
                  disabled={reportMutation.isPending}
                  className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Flag className="h-4 w-4" />
                  Report
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
