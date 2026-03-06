import { useState } from "react";
import type { PickupLine } from "./backend";
import { AdminPanel } from "./components/AdminPanel";
import { AppLayout } from "./components/AppLayout";
import { PickupLineDetail } from "./components/PickupLineDetail";
import { PickupLineFeed } from "./components/PickupLineFeed";
import { SubmitPickupLineForm } from "./components/SubmitPickupLineForm";
import { useApprovedPickupLines } from "./hooks/useQueries";

type View = "feed" | "submit" | "admin";

function AppContent() {
  const [currentView, setCurrentView] = useState<View>("feed");
  const [selectedPickupLineId, setSelectedPickupLineId] = useState<
    bigint | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: pickupLines,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useApprovedPickupLines();

  // Only show loading on initial load, not on background refetches
  const isInitialLoading = isLoading && !pickupLines;

  // Use empty array only if we have no data and no error
  const safePickupLines = pickupLines ?? [];

  const filteredPickupLines = safePickupLines.filter((line) =>
    line.text.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleRandomClick = () => {
    if (filteredPickupLines.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * filteredPickupLines.length,
      );
      setSelectedPickupLineId(filteredPickupLines[randomIndex].id);
    }
  };

  const handleSubmitSuccess = () => {
    setCurrentView("feed");
    // Trigger immediate refetch after successful submission
    refetch();
  };

  const handleSelectPickupLine = (pickupLine: PickupLine) => {
    setSelectedPickupLineId(pickupLine.id);
  };

  // Admin view renders outside the normal layout
  if (currentView === "admin") {
    return (
      <AppLayout
        currentView={currentView}
        onViewChange={setCurrentView}
        onRandomClick={handleRandomClick}
        hasPickupLines={filteredPickupLines.length > 0}
      >
        <AdminPanel onBack={() => setCurrentView("feed")} />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      currentView={currentView}
      onViewChange={setCurrentView}
      onRandomClick={handleRandomClick}
      hasPickupLines={filteredPickupLines.length > 0}
    >
      {currentView === "feed" ? (
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
