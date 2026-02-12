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
  const [selectedPickupLine, setSelectedPickupLine] = useState<PickupLine | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: pickupLines = [], isLoading } = usePickupLines();

  const filteredPickupLines = pickupLines.filter(line =>
    line.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRandomClick = () => {
    if (filteredPickupLines.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredPickupLines.length);
      setSelectedPickupLine(filteredPickupLines[randomIndex]);
    }
  };

  const handleSubmitSuccess = () => {
    setCurrentView('feed');
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
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectPickupLine={setSelectedPickupLine}
        />
      ) : (
        <SubmitPickupLineForm onSuccess={handleSubmitSuccess} />
      )}

      <PickupLineDetail
        pickupLine={selectedPickupLine}
        isOpen={!!selectedPickupLine}
        onClose={() => setSelectedPickupLine(null)}
      />
    </AppLayout>
  );
}

export default function App() {
  return <AppContent />;
}
