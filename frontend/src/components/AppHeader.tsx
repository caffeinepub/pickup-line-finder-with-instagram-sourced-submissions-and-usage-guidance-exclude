import { Heart, Sparkles, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface AppHeaderProps {
  currentView: 'feed' | 'submit';
  onViewChange: (view: 'feed' | 'submit') => void;
  onRandomClick: () => void;
  hasPickupLines: boolean;
}

export function AppHeader({ currentView, onViewChange, onRandomClick, hasPickupLines }: AppHeaderProps) {
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="border-b border-primary/20 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-soft">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!logoError ? (
              <img
                src="/assets/generated/rizzassist-logo.dim_512x256.png"
                alt="RizzAssist"
                className="h-12 w-auto smooth-render"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                RizzAssist
              </div>
            )}
          </div>

          <nav className="flex items-center gap-2">
            <Button
              variant={currentView === 'feed' ? 'default' : 'ghost'}
              onClick={() => onViewChange('feed')}
              className="gap-2 font-medium"
              size="default"
            >
              <Heart className="h-4 w-4" />
              Browse
            </Button>
            
            <Button
              variant="ghost"
              onClick={onRandomClick}
              disabled={!hasPickupLines}
              className="gap-2 font-medium"
              size="default"
            >
              <Sparkles className="h-4 w-4" />
              Random
            </Button>

            <Button
              variant={currentView === 'submit' ? 'default' : 'outline'}
              onClick={() => onViewChange('submit')}
              className="gap-2 font-medium"
              size="default"
            >
              <Plus className="h-4 w-4" />
              Submit
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
