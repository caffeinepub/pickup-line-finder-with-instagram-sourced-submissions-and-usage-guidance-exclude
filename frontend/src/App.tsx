import { useState } from 'react';
import { AppLayout } from './components/AppLayout';
import { PickupLineFeed } from './components/PickupLineFeed';
import { SubmitPickupLineForm } from './components/SubmitPickupLineForm';
import { PickupLineDetail } from './components/PickupLineDetail';
import { usePickupLines } from './hooks/useQueries';
import type { PickupLine } from './backend';

type View = 'feed' | 'submit';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('feed');
  const [selectedPickupLineId, setSelectedPickupLineId] = useState<bigint | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: pickupLines, isLoading, error, refetch, isRefetching } = usePickupLines();

  // Only show loading on initial load, not on background refetches
  const isInitialLoading = isLoading && !pickupLines;
  
  // Use empty array only if we have no data and no error
  const safePickupLines = pickupLines ?? [];

  const filteredPickupLines = safePickupLines.filter(line =>
    line.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRandomClick = () => {
    if (filteredPickupLines.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredPickupLines.length);
      setSelectedPickupLineId(filteredPickupLines[randomIndex].id);
    }
  };

  const handleSubmitSuccess = () => {
    setCurrentView('feed');
    // Trigger immediate refetch after successful submission
    refetch();
  };

  const handleSelectPickupLine = (pickupLine: PickupLine) => {
    setSelectedPickupLineId(pickupLine.id);
  };

  return (
    <AppLayout
      currentView={currentView}
      onViewChange={setCurrentView}
      onRandomClick={handleRandomClick}
      hasPickupLines={filteredPickupLines.length > 0}
    >
      {currentView === 'feed' ? (
        <PickupLineFeed
          pickupLines={filteredPickupLines}
          isLoading={isInitialLoading}
          isRefreshing={isRefetching}
          error={error}
          onRetry={refetch}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectPickupLine={handleSelectPickupLine}
        />
      ) : (
        <SubmitPickupLineForm onSuccess={handleSubmitSuccess} />
      )}

      <PickupLineDetail
        pickupLineId={selectedPickupLineId}
        isOpen={selectedPickupLineId !== null}
        onClose={() => setSelectedPickupLineId(null)}
      />
    </AppLayout>
  );
}

export default function App() {
  return <AppContent />;
}
