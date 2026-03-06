import { useState } from 'react';
import { Instagram, Sparkles, AlertCircle, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { useSubmitPickupLine } from '../hooks/useQueries';
import { validatePickupLine } from '../lib/validation';

interface SubmitPickupLineFormProps {
  onSuccess: () => void;
}

export function SubmitPickupLineForm({ onSuccess }: SubmitPickupLineFormProps) {
  const [text, setText] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const submitMutation = useSubmitPickupLine();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const validation = validatePickupLine(text);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid pickup line');
      return;
    }

    try {
      await submitMutation.mutateAsync({
        text: text.trim(),
        instagramUrl: instagramUrl.trim() || null,
      });
      setText('');
      setInstagramUrl('');
      // Call onSuccess which will navigate back to feed and trigger immediate refetch
      onSuccess();
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Failed to submit pickup line');
    }
  };

  const isSubmitting = submitMutation.isPending;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header section with theme token gradient */}
      <div className="relative bg-gradient-to-br from-primary/30 via-secondary/40 to-accent/30 rounded-3xl p-8 md:p-12 overflow-hidden border-2 border-primary/30 shadow-large">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-10 w-10 text-white drop-shadow-md" />
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md">
              Share Your Rizz
            </h1>
          </div>
          <p className="text-lg text-white/95 leading-relaxed drop-shadow">
            Submit your best multi-line pickup line and help others level up their conversation game.
          </p>
        </div>
      </div>

      <Card className="border-2 border-primary/20 shadow-large bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Send className="h-6 w-6 text-primary" />
            Submit Pickup Line
          </CardTitle>
          <CardDescription className="text-base leading-relaxed">
            Share a creative multi-line pickup line. Make sure it's appropriate and follows our guidelines.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="text" className="text-base font-semibold">
                Pickup Line <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="text"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setValidationError(null);
                }}
                placeholder="Enter your multi-line pickup line here...&#10;&#10;Example:&#10;Are you a magician?&#10;Because whenever I look at you,&#10;everyone else disappears."
                className="min-h-[200px] text-base border-2 border-primary/20 focus:border-primary/40 resize-none"
                disabled={isSubmitting}
                required
              />
              <p className="text-sm text-muted-foreground">
                Must be at least 3 lines. Maximum 500 characters.
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="instagram" className="text-base font-semibold flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                Instagram URL (Optional)
              </Label>
              <Input
                id="instagram"
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/..."
                className="text-base border-2 border-primary/20 focus:border-primary/40"
                disabled={isSubmitting}
              />
              <p className="text-sm text-muted-foreground">
                Share where you found this pickup line (optional).
              </p>
            </div>

            {validationError && (
              <Alert variant="destructive" className="border-2">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="text-sm font-medium">
                  {validationError}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full text-base h-12 gap-2 shadow-medium hover:shadow-large transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Submit Pickup Line
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Alert className="border-2 border-primary/20 bg-primary/5">
        <AlertCircle className="h-5 w-5 text-primary" />
        <AlertDescription className="text-sm leading-relaxed">
          <strong className="font-semibold">Guidelines:</strong> Pickup lines must be multi-line (at least 3 lines), 
          appropriate, and respectful. Inappropriate content will be removed.
        </AlertDescription>
      </Alert>
    </div>
  );
}
