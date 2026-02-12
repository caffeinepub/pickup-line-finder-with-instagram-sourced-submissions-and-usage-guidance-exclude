import { Search, MessageCircleHeart, AlertCircle, Sparkles } from 'lucide-react';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import { useReportPickupLine } from '../hooks/useQueries';
import type { PickupLine } from '../backend';

interface PickupLineFeedProps {
  pickupLines: PickupLine[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectPickupLine: (pickupLine: PickupLine) => void;
}

const REPORT_THRESHOLD = 5;

export function PickupLineFeed({
  pickupLines,
  isLoading,
  searchQuery,
  onSearchChange,
  onSelectPickupLine,
}: PickupLineFeedProps) {
  const reportMutation = useReportPickupLine();

  const visiblePickupLines = pickupLines.filter(
    (line) => Number(line.reportCount) < REPORT_THRESHOLD
  );

  const handleReport = (e: React.MouseEvent, id: bigint) => {
    e.stopPropagation();
    if (confirm('Report this pickup line as inappropriate?')) {
      reportMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero section with theme token gradient */}
      <div className="relative bg-gradient-to-br from-primary/30 via-secondary/40 to-accent/30 rounded-3xl p-8 md:p-12 overflow-hidden border-2 border-primary/30 shadow-large">
        {/* Hero illustration with smooth rendering */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 pointer-events-none hidden lg:block" aria-hidden="true">
          <img
            src="/assets/generated/hero-illustration.dim_1600x900.png"
            alt=""
            className="h-full w-full object-cover object-left smooth-render"
          />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircleHeart className="h-10 w-10 text-white drop-shadow-md" />
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md">
              Discover Rizz
            </h1>
          </div>
          <p className="text-lg text-white/95 mb-6 leading-relaxed drop-shadow">
            Browse our collection of creative multi-line pickup lines from Instagram. 
            Find the perfect conversation starter and learn how to use it effectively.
          </p>
          
          {/* Search bar with vibrant styling */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search pickup lines..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 h-14 text-base bg-white/95 backdrop-blur-sm border-2 border-white/50 shadow-medium focus:border-white"
            />
          </div>
        </div>
      </div>

      {/* Loading state with designed skeletons */}
      {isLoading ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <h2 className="text-2xl font-bold">Loading pickup lines...</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden border-2 border-primary/20 shadow-soft">
                <CardHeader className="space-y-3 pb-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : visiblePickupLines.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto space-y-6">
            <div className="relative w-48 h-48 mx-auto opacity-60">
              <img
                src="/assets/generated/heart-chat-illustration.dim_512x512.png"
                alt=""
                className="w-full h-full object-contain smooth-render"
              />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">No pickup lines found</h2>
              <p className="text-muted-foreground leading-relaxed">
                {searchQuery
                  ? 'Try adjusting your search terms or browse all pickup lines.'
                  : 'Be the first to submit a pickup line!'}
              </p>
            </div>
            {searchQuery && (
              <Button
                onClick={() => onSearchChange('')}
                variant="outline"
                className="gap-2 border-2 border-primary/30"
              >
                Clear Search
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              {searchQuery ? 'Search Results' : 'All Pickup Lines'}
            </h2>
            <Badge variant="secondary" className="text-sm px-3 py-1 bg-primary/10 text-primary border-primary/30">
              {visiblePickupLines.length} line{visiblePickupLines.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visiblePickupLines.map((pickupLine) => (
              <Card
                key={Number(pickupLine.id)}
                className="cursor-pointer hover:shadow-large transition-all duration-300 overflow-hidden border-2 border-primary/20 hover:border-primary/40 bg-white/80 backdrop-blur-sm relative group"
                onClick={() => onSelectPickupLine(pickupLine)}
              >
                <CardHeader className="relative z-10">
                  <CardTitle className="text-lg line-clamp-2 leading-snug">
                    {pickupLine.text.split('\n')[0]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed whitespace-pre-wrap mb-4">
                    {pickupLine.text}
                  </p>
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs gap-1.5 text-primary hover:text-primary/80 hover:bg-primary/10"
                    >
                      <MessageCircleHeart className="h-3.5 w-3.5" />
                      View Details
                    </Button>
                    {Number(pickupLine.reportCount) > 0 && (
                      <Badge variant="outline" className="text-xs border-destructive/30 text-destructive">
                        {Number(pickupLine.reportCount)} report{Number(pickupLine.reportCount) !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
