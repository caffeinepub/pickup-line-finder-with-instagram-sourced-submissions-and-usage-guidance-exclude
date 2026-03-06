import { AlertCircle, Instagram, Loader2, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { useSubmitPickupLine } from "../hooks/useQueries";
import { validatePickupLine } from "../lib/validation";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface SubmitPickupLineFormProps {
  onSuccess: () => void;
}

export function SubmitPickupLineForm({ onSuccess }: SubmitPickupLineFormProps) {
  const [text, setText] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const submitMutation = useSubmitPickupLine();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const validation = validatePickupLine(text);
    if (!validation.isValid) {
      setValidationError(validation.error || "Invalid pickup line");
      return;
    }

    try {
      await submitMutation.mutateAsync({
        text: text.trim(),
        instagramUrl: instagramUrl.trim() || null,
      });
      setText("");
      setInstagramUrl("");
      onSuccess();
    } catch (error) {
      setValidationError(
        error instanceof Error ? error.message : "Failed to submit pickup line",
      );
    }
  };

  const isSubmitting = submitMutation.isPending;
  const charCount = text.length;
  const charLimit = 500;

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-20"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, oklch(0.55 0.22 25 / 0.4) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 container mx-auto px-4 py-16 max-w-2xl flex-1">
        {/* Page header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary tracking-wide uppercase">
              Share Your Best
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-foreground mb-3 tracking-tight">
            Share Your Rizz
          </h1>
          <div className="w-16 h-1 bg-primary rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground text-base leading-relaxed max-w-sm mx-auto">
            Submit your best multi-line pickup line and help others level up
            their conversation game.
          </p>
        </div>

        {/* Form card */}
        <Card className="bg-card border border-border/60 shadow-large relative overflow-hidden">
          {/* Left red accent */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/80 via-primary/40 to-transparent rounded-l" />

          <CardHeader className="pb-0">
            <CardTitle className="text-xl font-display font-bold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
                <Send className="h-4 w-4 text-primary" />
              </div>
              Submit a Line
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Pickup line textarea */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="text"
                    className="text-sm font-semibold text-foreground"
                  >
                    Your Rizz Line <span className="text-destructive">*</span>
                  </Label>
                  <span
                    className={`text-xs font-mono transition-colors ${
                      charCount > charLimit
                        ? "text-destructive"
                        : charCount > charLimit * 0.8
                          ? "text-primary/70"
                          : "text-muted-foreground"
                    }`}
                  >
                    {charCount}/{charLimit}
                  </span>
                </div>
                <Textarea
                  id="text"
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    setValidationError(null);
                  }}
                  placeholder={
                    "Enter your multi-line pickup line here...\n\nExample:\nAre you a magician?\nBecause whenever I look at you,\neveryone else disappears."
                  }
                  className="min-h-[200px] text-sm bg-background/50 border-border/60 focus:border-primary/50 focus:ring-primary/20 resize-none text-foreground placeholder:text-muted-foreground/40 leading-relaxed"
                  disabled={isSubmitting}
                  required
                  data-ocid="submit.textarea"
                />
                <p className="text-xs text-muted-foreground">
                  Must be at least 3 lines. Each new line = press Enter.
                </p>
              </div>

              {/* Instagram URL */}
              <div className="space-y-2">
                <Label
                  htmlFor="instagram"
                  className="text-sm font-semibold text-foreground flex items-center gap-2"
                >
                  <Instagram className="h-3.5 w-3.5 text-muted-foreground" />
                  Instagram Source{" "}
                  <span className="text-muted-foreground font-normal text-xs">
                    (Optional)
                  </span>
                </Label>
                <Input
                  id="instagram"
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="text-sm bg-background/50 border-border/60 focus:border-primary/50 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground/40"
                  disabled={isSubmitting}
                />
              </div>

              {/* Validation error */}
              {validationError && (
                <Alert
                  variant="destructive"
                  className="border-destructive/30 bg-destructive/5"
                  data-ocid="submit.error_state"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {validationError}
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                size="lg"
                disabled={
                  isSubmitting || charCount === 0 || charCount > charLimit
                }
                className="w-full h-12 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 btn-glow hover:shadow-glow-red transition-all gap-2 disabled:opacity-40"
                data-ocid="submit.submit_button"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting for review...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit for Review
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Guidelines */}
        <div className="mt-6 rounded-xl border border-border/40 bg-card/50 p-4">
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground mb-1">
                Submission Guidelines
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Lines must be multi-line (at least 3 lines), appropriate, and
                respectful. All submissions are reviewed before publishing.
                Inappropriate content will be removed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
