import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Flame,
  Loader2,
  RefreshCw,
  Search,
  Share2,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  Trophy,
  Wand2,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PickupLine } from "../backend";
import { Category, EmojiType } from "../backend";
import {
  useAddEmojiReaction,
  useDownvotePickupLine,
  useLeaderboard,
  useLikePickupLine,
  useRecordCopy,
  useReportPickupLine,
  useRizzOfTheDay,
} from "../hooks/useQueries";
import { generateAiLines, improveRizzLine } from "../lib/aiRizzGenerator";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";
import { Textarea } from "./ui/textarea";

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
const PAGE_SIZE = 12;

type SortMode = "trending" | "top" | "newest" | "underrated";

const CATEGORY_LABELS: Record<Category, string> = {
  [Category.Uncategorized]: "All",
  [Category.Funny]: "😂 Funny",
  [Category.Smooth]: "😏 Smooth",
  [Category.Cheesy]: "🧀 Cheesy",
  [Category.Savage]: "🔥 Savage",
  [Category.Romantic]: "❤️ Romantic",
  [Category.Nerdy]: "🤓 Nerdy",
  [Category.Opener]: "👋 Opener",
  [Category.Comeback]: "💬 Comeback",
  [Category.Cringe]: "😬 Cringe",
};

const EMOJI_MAP: { key: EmojiType; icon: string; label: string }[] = [
  { key: EmojiType.Laugh, icon: "😂", label: "Laugh" },
  { key: EmojiType.Heart, icon: "❤️", label: "Heart" },
  { key: EmojiType.Fire, icon: "🔥", label: "Fire" },
  { key: EmojiType.Skull, icon: "💀", label: "Skull" },
];

// --- Confetti burst ---
function spawnConfetti(anchor: HTMLElement) {
  const rect = anchor.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const colors = [
    "#e63946",
    "#f4a261",
    "#ffe66d",
    "#06d6a0",
    "#118ab2",
    "#ff6b9d",
  ];

  for (let i = 0; i < 20; i++) {
    const el = document.createElement("div");
    const angle = (i / 20) * 360;
    const dist = 50 + Math.random() * 60;
    const tx = Math.cos((angle * Math.PI) / 180) * dist;
    const ty = Math.sin((angle * Math.PI) / 180) * dist - 20;
    const rot = Math.random() * 720 - 360;
    const size = 6 + Math.random() * 6;
    const color = colors[Math.floor(Math.random() * colors.length)];

    el.style.cssText = `
      position: fixed;
      left: ${cx}px;
      top: ${cy}px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
      pointer-events: none;
      z-index: 9999;
      --tx: ${tx}px;
      --ty: ${ty}px;
      --rot: ${rot}deg;
    `;
    el.classList.add("animate-confetti");
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 850);
  }
}

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
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, oklch(0.58 0.22 25 / 0.35) 30%, oklch(0.58 0.22 25 / 0.35) 70%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, oklch(0.58 0.22 25 / 0.20) 30%, oklch(0.58 0.22 25 / 0.20) 70%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      <div className="container mx-auto px-4 max-w-4xl">
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

        {isGenerating && (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card
                key={i}
                className="bg-card border-border/60 overflow-hidden"
                data-ocid="ai.loading_state"
              >
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-5 w-16 rounded-full animate-shimmer" />
                  <Skeleton className="h-4 w-full animate-shimmer" />
                  <Skeleton className="h-4 w-5/6 animate-shimmer" />
                  <Skeleton className="h-4 w-4/6 animate-shimmer" />
                  <Skeleton className="h-8 w-24 animate-shimmer" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isGenerating && hasGenerated && results.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {results.map((line, lineIdx) => (
              <Card
                key={line.slice(0, 20)}
                className="bg-card border-border/50 card-hover group relative overflow-hidden"
                style={{ animationDelay: `${lineIdx * 0.08}s` }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary/70 rounded-l" />
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-primary/15 text-primary border-primary/25 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5">
                      <Sparkles className="h-2.5 w-2.5 mr-1" />
                      AI Generated
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-medium mb-4">
                    {line}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void handleCopy(line, lineIdx)}
                    className={`gap-2 text-xs border-border/60 transition-all ${
                      copiedIndex === lineIdx
                        ? "border-primary/50 text-primary bg-primary/5"
                        : "hover:border-primary/40 hover:text-primary hover:bg-primary/5"
                    }`}
                    data-ocid={`ai.card.copy_button.${lineIdx + 1}`}
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

// ---------- Improve My Rizz Section ----------
function ImproveMyRizz() {
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleImprove = async () => {
    if (!input.trim()) return;
    setIsGenerating(true);
    setHasGenerated(false);
    await new Promise((r) => setTimeout(r, 1200));
    const improved = improveRizzLine(input);
    setResults(improved);
    setIsGenerating(false);
    setHasGenerated(true);
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // silent
    }
  };

  return (
    <section id="improve-rizz" className="py-20 md:py-24 relative">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, oklch(0.58 0.22 25 / 0.2) 40%, oklch(0.58 0.22 25 / 0.2) 60%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary tracking-wide uppercase">
              Upgrade Your Game
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Improve My Rizz
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
            Paste any line — we'll rewrite it 3 ways to make it smoother,
            bolder, or wittier.
          </p>
        </div>

        <Card className="bg-card border-border/60 relative overflow-hidden mb-8">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/80 via-primary/40 to-transparent" />
          <CardContent className="p-6">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                "Paste your rizz line here...\n\nE.g. Are you a bank loan? Because you have my interest."
              }
              className="min-h-[120px] text-sm bg-background/50 border-border/60 focus:border-primary/50 focus:ring-primary/20 resize-none text-foreground placeholder:text-muted-foreground/40 leading-relaxed mb-4"
              data-ocid="improve.textarea"
            />
            <Button
              onClick={() => void handleImprove()}
              disabled={isGenerating || !input.trim()}
              className="h-11 px-7 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 btn-glow disabled:opacity-40 gap-2"
              data-ocid="improve.primary_button"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Improving...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Improve My Rizz
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {isGenerating && (
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="bg-card border-border/60"
                data-ocid="improve.loading_state"
              >
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-5 w-20 animate-shimmer" />
                  <Skeleton className="h-4 w-full animate-shimmer" />
                  <Skeleton className="h-4 w-5/6 animate-shimmer" />
                  <Skeleton className="h-8 w-20 animate-shimmer" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isGenerating && hasGenerated && results.length > 0 && (
          <div className="grid gap-4 md:grid-cols-3">
            {results.map((line, idx) => (
              <Card
                key={line.slice(0, 30)}
                className="bg-card border-border/50 card-hover group relative overflow-hidden"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary/60 rounded-l" />
                <CardContent className="p-5 flex flex-col gap-3">
                  <Badge className="self-start bg-primary/10 text-primary border-primary/20 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5">
                    Version {idx + 1}
                  </Badge>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-medium flex-1">
                    {line}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void handleCopy(line, idx)}
                    className={`gap-2 text-xs border-border/60 self-start transition-all ${
                      copiedIndex === idx
                        ? "border-primary/50 text-primary bg-primary/5"
                        : "hover:border-primary/40 hover:text-primary hover:bg-primary/5"
                    }`}
                    data-ocid={`improve.card.copy_button.${idx + 1}`}
                  >
                    {copiedIndex === idx ? (
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
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const [reactedEmojis, setReactedEmojis] = useState<Set<EmojiType>>(new Set());
  const [copiedToast, setCopiedToast] = useState(false);
  const confettiRef = useRef<HTMLButtonElement>(null);

  const likeMutation = useLikePickupLine();
  const downvoteMutation = useDownvotePickupLine();
  const recordCopyMutation = useRecordCopy();
  const emojiMutation = useAddEmojiReaction();

  const likeCount = Number(pickupLine.likeCount) + (upvoted ? 1 : 0);
  const isPopular = likeCount > 10;
  const firstLine = pickupLine.text.split("\n")[0];
  const ocidIndex = index + 1;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(pickupLine.text);
      setCopied(true);
      setCopiedToast(true);
      recordCopyMutation.mutate(pickupLine.id);
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => setCopiedToast(false), 3000);
    } catch {
      // silent fail
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `${pickupLine.text}\n\n— RizzAssist`;
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText, title: "RizzAssist Line" });
      } catch {
        // cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 3000);
      } catch {
        // silent
      }
    }
  };

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (upvoted || downvoted) return;
    setUpvoted(true);
    likeMutation.mutate(pickupLine.id, {
      onSuccess: () => {
        // Check if now at 100 upvotes — fire confetti
        if (likeCount + 1 >= 100 && confettiRef.current) {
          spawnConfetti(confettiRef.current);
        }
      },
    });
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (upvoted || downvoted) return;
    setDownvoted(true);
    downvoteMutation.mutate(pickupLine.id);
  };

  const handleEmojiReact = (e: React.MouseEvent, emoji: EmojiType) => {
    e.stopPropagation();
    if (reactedEmojis.has(emoji)) return;
    setReactedEmojis((prev) => new Set([...prev, emoji]));
    emojiMutation.mutate({ id: pickupLine.id, emoji });
  };

  return (
    <div
      className="opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.05}s` }}
      data-ocid={`feed.item.${ocidIndex}`}
    >
      <Card
        className={`bg-card border card-hover group cursor-pointer relative overflow-hidden h-full transition-all ${
          isPopular
            ? "border-primary/40 shadow-glow-red-sm"
            : "border-border/50"
        }`}
        onClick={() => onSelect(pickupLine)}
      >
        {/* Left accent */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-l-lg transition-colors duration-250 ${
            isPopular
              ? "bg-primary/60 group-hover:bg-primary"
              : "bg-primary/20 group-hover:bg-primary/70"
          }`}
        />

        {/* Trending badge */}
        {isPopular && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-primary/15 border border-primary/25 rounded-full px-2 py-0.5">
            <Flame className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-bold text-primary">Trending</span>
          </div>
        )}

        <CardContent className="pl-6 pr-5 py-5 flex flex-col gap-3 h-full">
          {/* Category badge */}
          {pickupLine.category !== Category.Uncategorized && (
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-[10px] border-border/50 text-muted-foreground px-2 py-0.5 font-medium"
              >
                {CATEGORY_LABELS[pickupLine.category] ?? pickupLine.category}
              </Badge>
              {pickupLine.username && (
                <span className="text-[10px] text-muted-foreground/60">
                  by @{pickupLine.username}
                </span>
              )}
            </div>
          )}

          {/* Title line */}
          <h3 className="font-display font-semibold text-sm text-foreground line-clamp-1 leading-snug">
            {firstLine}
          </h3>

          {/* Full text preview */}
          <p className="text-xs text-muted-foreground/80 line-clamp-4 leading-[1.7] whitespace-pre-wrap flex-1">
            {pickupLine.text}
          </p>

          {/* Emoji reactions */}
          <div className="flex items-center gap-1.5 pt-1">
            {EMOJI_MAP.map(({ key, icon, label }) => {
              const count =
                Number(
                  key === EmojiType.Laugh
                    ? pickupLine.emojiReactions.laugh
                    : key === EmojiType.Heart
                      ? pickupLine.emojiReactions.heart
                      : key === EmojiType.Fire
                        ? pickupLine.emojiReactions.fire
                        : pickupLine.emojiReactions.skull,
                ) + (reactedEmojis.has(key) ? 1 : 0);

              return (
                <button
                  key={key}
                  type="button"
                  onClick={(e) => handleEmojiReact(e, key)}
                  aria-label={label}
                  className={`flex items-center gap-0.5 text-[11px] rounded-full px-1.5 py-0.5 transition-all hover:scale-110 ${
                    reactedEmojis.has(key)
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                  data-ocid={`feed.card.toggle.${ocidIndex}`}
                >
                  <span>{icon}</span>
                  {count > 0 && <span className="font-medium">{count}</span>}
                </button>
              );
            })}
          </div>

          {/* Bottom actions */}
          <div className="flex items-center gap-1.5 pt-1 border-t border-border/40">
            {/* Upvote */}
            <Button
              ref={confettiRef}
              variant="ghost"
              size="sm"
              onClick={handleUpvote}
              disabled={upvoted || downvoted}
              className={`gap-1 text-xs h-7 px-2 flex-shrink-0 transition-all ${
                upvoted
                  ? "text-primary cursor-default"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              }`}
              data-ocid={`feed.card.toggle.${ocidIndex}`}
            >
              <ThumbsUp
                className={`h-3 w-3 ${upvoted ? "fill-primary" : ""}`}
              />
              <span>{likeCount}</span>
            </Button>

            {/* Downvote */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownvote}
              disabled={upvoted || downvoted}
              className={`gap-1 text-xs h-7 px-2 flex-shrink-0 transition-all ${
                downvoted
                  ? "text-muted-foreground cursor-default"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              data-ocid={`feed.card.secondary_button.${ocidIndex}`}
            >
              <ThumbsDown
                className={`h-3 w-3 ${downvoted ? "fill-muted-foreground" : ""}`}
              />
            </Button>

            {/* Copy */}
            <div className="relative">
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
              {/* Post-copy toast */}
              {copiedToast && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium bg-card border border-border/60 text-primary px-2 py-1 rounded-md shadow-medium pointer-events-none animate-fade-in-down z-20">
                  Share it 🔥
                </div>
              )}
            </div>

            {/* Share */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="gap-1.5 text-xs h-7 px-2 flex-shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              data-ocid={`feed.card.button.${ocidIndex}`}
            >
              <Share2 className="h-3.5 w-3.5" />
            </Button>

            {/* View Details */}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(pickupLine);
              }}
              className="text-xs h-7 px-2 ml-auto text-muted-foreground/60 hover:text-primary hover:bg-primary/5 transition-all"
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

// ---------- Rizz of the Day Banner ----------
function RizzOfTheDayBanner({
  onSelect,
}: { onSelect: (line: PickupLine) => void }) {
  const { data: rizzOfDay } = useRizzOfTheDay();

  if (!rizzOfDay) return null;

  return (
    <button
      type="button"
      className="w-full text-left rounded-2xl border-2 border-primary/50 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-5 mb-8 relative overflow-hidden cursor-pointer group"
      onClick={() => onSelect(rizzOfDay)}
      data-ocid="feed.rizz_of_the_day.card"
    >
      {/* Glow */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 20% 50%, oklch(0.58 0.22 25 / 0.5) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-2xl animate-pulse-glow">
            🔥
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Badge className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                Rizz of the Day
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {Number(rizzOfDay.likeCount)} upvotes · Today's top pick
            </p>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground line-clamp-2 leading-relaxed whitespace-pre-wrap">
            {rizzOfDay.text}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-primary/60 group-hover:text-primary transition-colors shrink-0 hidden sm:block" />
      </div>
    </button>
  );
}

// ---------- Trending Panel ----------
function TrendingPanel({ allLines }: { allLines: PickupLine[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: leaderboard = [] } = useLeaderboard();

  const topCopied = [...allLines]
    .sort((a, b) => Number(b.copyCount) - Number(a.copyCount))
    .slice(0, 5);

  // Category frequency
  const catCounts: Record<string, number> = {};
  for (const line of allLines) {
    const cat = line.category;
    if (cat !== Category.Uncategorized) {
      catCounts[cat] = (catCounts[cat] ?? 0) + 1;
    }
  }
  const topCategories = Object.entries(catCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const topCreators = leaderboard.slice(0, 5);

  return (
    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden mt-8">
      <button
        type="button"
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
        onClick={() => setIsOpen((p) => !p)}
        data-ocid="feed.trending.toggle"
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="font-display font-semibold text-sm text-foreground">
            Trending Panel
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className="grid gap-4 sm:grid-cols-3 px-5 pb-5 border-t border-border/40 pt-5"
          data-ocid="feed.trending.panel"
        >
          {/* Most Copied */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Copy className="h-3.5 w-3.5" />
              Most Copied
            </p>
            <div className="space-y-2">
              {topCopied.length === 0 ? (
                <p className="text-xs text-muted-foreground/60">No data yet</p>
              ) : (
                topCopied.map((line, i) => (
                  <div
                    key={Number(line.id)}
                    className="flex items-center gap-2"
                    data-ocid={`feed.trending.item.${i + 1}`}
                  >
                    <span className="text-xs font-bold text-primary/60 w-4">
                      {i + 1}.
                    </span>
                    <p className="text-xs text-foreground/80 truncate flex-1">
                      {line.text.split("\n")[0]}
                    </p>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {Number(line.copyCount)}x
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Creators */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5" />
              Top Creators
            </p>
            <div className="space-y-2">
              {topCreators.length === 0 ? (
                <p className="text-xs text-muted-foreground/60">No data yet</p>
              ) : (
                topCreators.map((entry, i) => (
                  <div
                    key={entry.username}
                    className="flex items-center gap-2"
                    data-ocid={`feed.leaderboard.item.${i + 1}`}
                  >
                    <span className="text-xs font-bold text-primary/60 w-4">
                      {i + 1}.
                    </span>
                    <p className="text-xs text-foreground/80 flex-1 truncate">
                      @{entry.username}
                    </p>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {Number(entry.totalUpvotes)} pts
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Categories */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Hot Categories
            </p>
            <div className="space-y-2">
              {topCategories.length === 0 ? (
                <p className="text-xs text-muted-foreground/60">
                  No categories yet
                </p>
              ) : (
                topCategories.map(([cat, count], i) => (
                  <div
                    key={cat}
                    className="flex items-center gap-2"
                    data-ocid={`feed.categories.item.${i + 1}`}
                  >
                    <span className="text-xs font-bold text-primary/60 w-4">
                      {i + 1}.
                    </span>
                    <p className="text-xs text-foreground/80 flex-1">
                      {CATEGORY_LABELS[cat as Category] ?? cat}
                    </p>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Sort + Category Controls ----------
interface FeedControlsProps {
  sortMode: SortMode;
  onSortChange: (mode: SortMode) => void;
  activeCategory: Category | "all";
  onCategoryChange: (cat: Category | "all") => void;
}

const SORT_OPTIONS: { key: SortMode; label: string }[] = [
  { key: "trending", label: "🔥 Trending Today" },
  { key: "top", label: "👑 Top All Time" },
  { key: "newest", label: "🆕 Newest" },
  { key: "underrated", label: "💎 Underrated" },
];

function FeedControls({
  sortMode,
  onSortChange,
  activeCategory,
  onCategoryChange,
}: FeedControlsProps) {
  const allCategories: Array<{ key: Category | "all"; label: string }> = [
    { key: "all", label: "All" },
    ...Object.entries(CATEGORY_LABELS)
      .filter(([k]) => k !== Category.Uncategorized)
      .map(([k, v]) => ({ key: k as Category, label: v })),
  ];

  return (
    <div className="space-y-3 mb-6">
      {/* Sort pills */}
      <div className="flex flex-wrap gap-2">
        {SORT_OPTIONS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onSortChange(key)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
              sortMode === key
                ? "bg-primary text-primary-foreground border-primary shadow-glow-red-sm"
                : "bg-card border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
            data-ocid="feed.sort.tab"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2">
        {allCategories.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onCategoryChange(key)}
            className={`text-xs font-medium px-3 py-1 rounded-full border transition-all ${
              activeCategory === key
                ? "bg-primary/15 text-primary border-primary/40"
                : "bg-card border-border/50 text-muted-foreground/70 hover:border-primary/30 hover:text-foreground"
            }`}
            data-ocid="feed.category.tab"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- Sorting function ----------
function sortLines(lines: PickupLine[], mode: SortMode): PickupLine[] {
  const now = Date.now();
  const oneDayAgo = BigInt(now - 24 * 60 * 60 * 1000) * BigInt(1_000_000); // nanoseconds

  switch (mode) {
    case "trending":
      return [...lines]
        .filter((l) => l.submittedAt >= oneDayAgo)
        .sort((a, b) => Number(b.likeCount) - Number(a.likeCount));
    case "top":
      return [...lines].sort(
        (a, b) => Number(b.likeCount) - Number(a.likeCount),
      );
    case "newest":
      return [...lines].sort(
        (a, b) => Number(b.submittedAt) - Number(a.submittedAt),
      );
    case "underrated":
      return [...lines]
        .filter((l) => Number(l.likeCount) < 5)
        .sort((a, b) => Number(b.copyCount) - Number(a.copyCount));
    default:
      return lines;
  }
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
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleSortChange = (mode: SortMode) => {
    setSortMode(mode);
    setVisibleCount(PAGE_SIZE);
  };

  const handleCategoryChange = (cat: Category | "all") => {
    setActiveCategory(cat);
    setVisibleCount(PAGE_SIZE);
  };

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

  // Filter, sort, paginate
  const visiblePickupLines = pickupLines.filter(
    (line) => Number(line.reportCount) < REPORT_THRESHOLD,
  );

  const categoryFiltered =
    activeCategory === "all"
      ? visiblePickupLines
      : visiblePickupLines.filter((l) => l.category === activeCategory);

  const sorted = sortLines(categoryFiltered, sortMode);
  const paginatedLines = sorted.slice(0, visibleCount);
  const hasMore = paginatedLines.length < sorted.length;

  // Infinite scroll via IntersectionObserver
  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  }, []);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          handleLoadMore();
        }
      },
      { rootMargin: "200px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, handleLoadMore]);

  // Reset pagination when search changes - handled via key derivation below

  return (
    <div>
      {/* ===== SECTION A: HERO ===== */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col items-center justify-center py-20 overflow-hidden"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 20%, oklch(0.55 0.22 25 / 0.18) 0%, transparent 65%)",
          }}
        />
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
          <div
            className="opacity-0 animate-fade-in-up inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-8"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-primary tracking-widest uppercase">
              Your Rizz Companion
            </span>
          </div>

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

      {/* ===== SECTION C: IMPROVE MY RIZZ ===== */}
      <ImproveMyRizz />

      {/* ===== SECTION D: COMMUNITY FEED ===== */}
      <section id="feed" className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 rounded-full px-4 py-1.5 mb-4">
                <Flame className="h-3.5 w-3.5 text-primary" />
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
                  {sorted.length} line{sorted.length !== 1 ? "s" : ""}
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

          {/* Rizz of the Day */}
          <RizzOfTheDayBanner onSelect={onSelectPickupLine} />

          {/* Search */}
          <div className="relative max-w-md mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search pickup lines..."
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              className="pl-10 h-11 bg-card border-border/60 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20"
              data-ocid="feed.search_input"
            />
          </div>

          {/* Sort + Category controls */}
          <FeedControls
            sortMode={sortMode}
            onSortChange={handleSortChange}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />

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
          ) : paginatedLines.length === 0 && !error ? (
            /* Empty state */
            <div
              className="flex flex-col items-center justify-center py-24 text-center"
              data-ocid="feed.empty_state"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center mb-5">
                <Flame className="h-7 w-7 text-primary/60" />
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
            <>
              {/* Cards grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {paginatedLines.map((pickupLine, index) => (
                  <FeedCard
                    key={Number(pickupLine.id)}
                    pickupLine={pickupLine}
                    index={index}
                    onSelect={onSelectPickupLine}
                  />
                ))}
              </div>

              {/* Infinite scroll sentinel */}
              <div ref={loadMoreRef} className="h-10 mt-4" />

              {/* Manual load more fallback */}
              {hasMore && (
                <div className="flex justify-center mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLoadMore}
                    className="border-border/60 text-muted-foreground hover:border-primary/40 hover:text-primary gap-2"
                    data-ocid="feed.pagination_next"
                  >
                    <ChevronDown className="h-4 w-4" />
                    Load more ({sorted.length - visibleCount} remaining)
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Trending Panel */}
          <TrendingPanel allLines={visiblePickupLines} />
        </div>
      </section>
    </div>
  );
}
