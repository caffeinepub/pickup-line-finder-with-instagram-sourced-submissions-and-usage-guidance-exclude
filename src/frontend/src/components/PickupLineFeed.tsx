import {
  AlertCircle,
  Check,
  ChevronDown,
  Copy,
  Heart,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";
import { useState } from "react";
import type { PickupLine } from "../backend";
import { useLikePickupLine, useReportPickupLine } from "../hooks/useQueries";
import { generateAiLines } from "../lib/aiRizzGenerator";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";

interface PickupLineFeedProps {
  pickupLines: PickupLine[];
  isLoading: boolean;
  isRefreshing?: boolean;
  error: Error | null;
  onRetry: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectPickupLine: (pickupLine: PickupLine) => void;
}

const REPORT_THRESHOLD = 5;

// ---------- AI Generator Section ----------
function AiRizzGenerator() {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setHasGenerated(false);
    // Simulate AI thinking time
    await new Promise((r) => setTimeout(r, 1500));
    const lines = generateAiLines(topic);
    setResults(lines);
    setIsGenerating(false);
    setHasGenerated(true);
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // fallback silently
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      void handleGenerate();
    }
  };

  return (
    <section id="ai-generator" className="py-24 md:py-32 relative">
      {/* Section divider top — red gradient fade */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, oklch(0.58 0.22 25 / 0.35) 30%, oklch(0.58 0.22 25 / 0.35) 70%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      {/* Section divider bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, oklch(0.58 0.22 25 / 0.20) 30%, oklch(0.58 0.22 25 / 0.20) 70%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-5">
            <Wand2 className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary tracking-wide uppercase">
              AI-Powered
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            AI Rizz Generator
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
            Type any topic and get custom rizz lines crafted for the moment.
          </p>
        </div>

        {/* Input area */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <div className="relative flex-1">
            <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a topic... (e.g. gym, coffee, stars, pizza)"
              className="pl-11 h-12 bg-card border-border/60 text-foreground placeholder:text-muted-foreground/60 focus:border-primary/60 focus:ring-primary/20 text-sm"
              data-ocid="ai.topic_input"
            />
          </div>
          <Button
            onClick={() => void handleGenerate()}
            disabled={isGenerating || !topic.trim()}
            className="h-12 px-8 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 btn-glow hover:shadow-glow-red disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
            data-ocid="ai.generate_button"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Generate
              </>
            )}
          </Button>
        </div>

        {/* Loading skeletons */}
        {isGenerating && (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card
                key={i}
                className="bg-card border-border/60 overflow-hidden"
                data-ocid="ai.loading_state"
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <Skeleton className="h-5 w-16 rounded-full animate-shimmer" />
                  </div>
                  <Skeleton className="h-4 w-full animate-shimmer" />
                  <Skeleton className="h-4 w-5/6 animate-shimmer" />
                  <Skeleton className="h-4 w-4/6 animate-shimmer" />
                  <div className="pt-2">
                    <Skeleton className="h-8 w-24 animate-shimmer" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Results */}
        {!isGenerating && hasGenerated && results.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {results.map((line, lineIdx) => (
              <Card
                key={line.slice(0, 20)}
                className="bg-card border-border/50 card-hover group relative overflow-hidden"
                style={{ animationDelay: `${lineIdx * 0.08}s` }}
              >
                {/* Red left accent */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary/70 rounded-l" />

                <CardContent className="p-5">
                  {/* Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-primary/15 text-primary border-primary/25 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5">
                      <Sparkles className="h-2.5 w-2.5 mr-1" />
                      AI Generated
                    </Badge>
                  </div>

                  {/* Line text */}
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-medium mb-4">
                    {line}
                  </p>

                  {/* Copy button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void handleCopy(line, lineIdx)}
                    className={`gap-2 text-xs border-border/60 transition-all ${
                      copiedIndex === lineIdx
                        ? "border-primary/50 text-primary bg-primary/5"
                        : "hover:border-primary/40 hover:text-primary hover:bg-primary/5"
                    }`}
                    data-ocid={`feed.card.copy_button.${lineIdx + 1}`}
                  >
                    {copiedIndex === lineIdx ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy Line
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ---------- Individual Feed Card ----------
interface FeedCardProps {
  pickupLine: PickupLine;
  index: number;
  onSelect: (line: PickupLine) => void;
}

function FeedCard({ pickupLine, index, onSelect }: FeedCardProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const likeMutation = useLikePickupLine();

  // Real like count from backend (optimistic +1 if this session already liked)
  const likeCount = Number(pickupLine.likeCount) + (liked ? 1 : 0);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(pickupLine.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silent fail
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) return; // Can't unlike — backend only increments
    setLiked(true);
    likeMutation.mutate(pickupLine.id);
  };

  const firstLine = pickupLine.text.split("\n")[0];
  const ocidIndex = index + 1;

  return (
    <div
      className="opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.05}s` }}
      data-ocid={`feed.item.${ocidIndex}`}
    >
      <Card
        className="bg-card border border-border/50 card-hover group cursor-pointer relative overflow-hidden h-full"
        onClick={() => onSelect(pickupLine)}
      >
        {/* Persistent left accent — always visible, intensifies on hover */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary/20 group-hover:bg-primary/70 transition-colors duration-250 rounded-l-lg" />

        <CardContent className="pl-6 pr-5 py-5 flex flex-col gap-3 h-full">
          {/* Title line */}
          <h3 className="font-display font-semibold text-sm text-foreground line-clamp-1 leading-snug">
            {firstLine}
          </h3>

          {/* Full text preview */}
          <p className="text-xs text-muted-foreground/80 line-clamp-4 leading-[1.7] whitespace-pre-wrap flex-1">
            {pickupLine.text}
          </p>

          {/* Bottom actions */}
          <div className="flex items-center gap-2 pt-1 border-t border-border/40">
            {/* Copy */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className={`gap-1.5 text-xs h-7 px-2.5 flex-shrink-0 transition-all ${
                copied
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              data-ocid={`feed.card.copy_button.${ocidIndex}`}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Copied!" : "Copy"}
            </Button>

            {/* Like */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={liked || likeMutation.isPending}
              className={`gap-1.5 text-xs h-7 px-2.5 flex-shrink-0 transition-all ${
                liked
                  ? "text-primary cursor-default"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              }`}
              data-ocid={`feed.card.toggle.${ocidIndex}`}
            >
              <Heart
                className={`h-3.5 w-3.5 transition-all ${liked ? "fill-primary text-primary scale-110" : ""}`}
              />
              <span>{likeCount}</span>
            </Button>

            {/* View Details */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(pickupLine);
              }}
              className="text-xs h-7 px-2.5 ml-auto text-muted-foreground/60 hover:text-primary hover:bg-primary/5 transition-all"
            >
              Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------- Skeleton Card ----------
function SkeletonCard() {
  return (
    <Card className="bg-card border-border/50 overflow-hidden">
      <CardContent className="p-5 space-y-3">
        <Skeleton className="h-4 w-3/4 animate-shimmer" />
        <Skeleton className="h-3 w-full animate-shimmer" />
        <Skeleton className="h-3 w-5/6 animate-shimmer" />
        <Skeleton className="h-3 w-4/6 animate-shimmer" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-7 w-16 animate-shimmer" />
          <Skeleton className="h-7 w-14 animate-shimmer" />
        </div>
      </CardContent>
    </Card>
  );
}

// ---------- Main Component ----------
export function PickupLineFeed({
  pickupLines,
  isLoading,
  isRefreshing,
  error,
  onRetry,
  searchQuery,
  onSearchChange,
  onSelectPickupLine,
}: PickupLineFeedProps) {
  const reportMutation = useReportPickupLine();

  const visiblePickupLines = pickupLines.filter(
    (line) => Number(line.reportCount) < REPORT_THRESHOLD,
  );

  const _handleReport = (e: React.MouseEvent, id: bigint) => {
    e.stopPropagation();
    if (confirm("Report this pickup line as inappropriate?")) {
      reportMutation.mutate(id);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      {/* ===== SECTION A: HERO ===== */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col items-center justify-center py-20 overflow-hidden"
      >
        {/* Background red glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 20%, oklch(0.55 0.22 25 / 0.18) 0%, transparent 65%)",
          }}
        />

        {/* Decorative grid lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.98 0 0 / 1) 1px, transparent 1px), linear-gradient(90deg, oklch(0.98 0 0 / 1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          {/* Pre-headline badge */}
          <div
            className="opacity-0 animate-fade-in-up inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-8"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-primary tracking-widest uppercase">
              Your Rizz Companion
            </span>
          </div>

          {/* Main headline */}
          <h1
            className="opacity-0 animate-fade-in-up font-display font-black tracking-tight mb-8"
            style={{ animationDelay: "0.2s", lineHeight: "1.04" }}
          >
            <span className="block text-5xl sm:text-7xl md:text-[96px] text-foreground">
              Unlimited Rizz.
            </span>
            <span className="block text-5xl sm:text-7xl md:text-[96px] text-gradient-red">
              Zero Effort.
            </span>
          </h1>

          {/* Sub-headline */}
          <p
            className="opacity-0 animate-fade-in-up text-lg md:text-xl leading-relaxed max-w-lg mx-auto mb-12"
            style={{
              animationDelay: "0.38s",
              color: "oklch(0.70 0 0)",
            }}
          >
            Browse, steal, and master the art of the rizz.
            <br className="hidden sm:block" />
            Powered by the internet's best lines.
          </p>

          {/* CTAs */}
          <div
            className="opacity-0 animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{ animationDelay: "0.52s" }}
          >
            <Button
              size="lg"
              onClick={() => scrollToSection("ai-generator")}
              className="h-13 px-9 bg-primary text-primary-foreground font-bold btn-glow hover:shadow-glow-red text-sm gap-2 w-full sm:w-auto rounded-xl"
              data-ocid="hero.generate_button"
            >
              <Wand2 className="h-4 w-4" />
              Generate Rizz with AI
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("feed")}
              className="h-13 px-9 border-border text-foreground/80 hover:border-primary/50 hover:text-foreground hover:bg-primary/8 font-semibold transition-all text-sm gap-2 w-full sm:w-auto rounded-xl"
              data-ocid="hero.browse_button"
            >
              <Search className="h-4 w-4" />
              Browse Lines
            </Button>
          </div>

          {/* Scroll hint */}
          <div
            className="opacity-0 animate-fade-in-up absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/40"
            style={{ animationDelay: "0.9s" }}
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ===== SECTION B: AI GENERATOR ===== */}
      <AiRizzGenerator />

      {/* ===== SECTION C: COMMUNITY FEED ===== */}
      <section id="feed" className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-4">
                <Heart className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary tracking-wide uppercase">
                  Community
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Community Lines
              </h2>
              <div className="w-16 h-1 bg-primary rounded-full mt-2" />
            </div>

            <div className="flex items-center gap-3">
              {!isLoading && (
                <Badge
                  variant="secondary"
                  className="bg-secondary text-secondary-foreground border border-border/60 text-sm px-3 py-1"
                >
                  {visiblePickupLines.length} line
                  {visiblePickupLines.length !== 1 ? "s" : ""}
                </Badge>
              )}

              {isRefreshing && !isLoading && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Refreshing</span>
                </div>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md mb-8">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search pickup lines..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-11 bg-card border-border/60 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20"
              data-ocid="feed.search_input"
            />
          </div>

          {/* Error state */}
          {error && (
            <Alert
              variant="destructive"
              className="mb-6 border-destructive/30 bg-destructive/5"
              data-ocid="feed.error_state"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-sm">
                  Failed to load pickup lines.{" "}
                  {error.message || "Please try again."}
                </span>
                <Button
                  onClick={onRetry}
                  variant="outline"
                  size="sm"
                  className="ml-4 gap-1.5 border-destructive/30 hover:bg-destructive/10 text-xs"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Loading grid */}
          {isLoading ? (
            <div
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              data-ocid="feed.loading_state"
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : visiblePickupLines.length === 0 && !error ? (
            /* Empty state */
            <div
              className="flex flex-col items-center justify-center py-24 text-center"
              data-ocid="feed.empty_state"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center mb-5">
                <Heart className="h-7 w-7 text-primary/60" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                {searchQuery ? "No matches found" : "No lines yet"}
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                {searchQuery
                  ? "Try a different search term or browse all lines."
                  : "Be the first to submit a rizz line!"}
              </p>
              {searchQuery && (
                <Button
                  onClick={() => onSearchChange("")}
                  variant="outline"
                  size="sm"
                  className="mt-5 border-border/60 hover:border-primary/40 hover:text-primary"
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            /* Cards grid */
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {visiblePickupLines.map((pickupLine, index) => (
                <FeedCard
                  key={Number(pickupLine.id)}
                  pickupLine={pickupLine}
                  index={index}
                  onSelect={onSelectPickupLine}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
