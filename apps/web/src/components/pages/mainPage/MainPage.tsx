import { lazy, Suspense } from "react";

import { useEventsContext } from "@contexts/eventsContext";
import MainLayout from "@layouts/mainLayout";
import ErrorBanner from "@shared/errorBanner";
import Spinner from "@shared/spinner";

import EventsList from "./components/eventsList";

import styles from "./mainPage.module.scss";

const CreateEventForm = lazy(() => import("./components/createEventForm"));

function MainPage() {
  const {
    groupedEvents,
    isLoading,
    isSyncing,
    error,
    syncEvents,
    createEvent,
    clearError,
  } = useEventsContext();

  const handleSync = async () => {
    await syncEvents();
  };

  const isDisabled = isSyncing;

  if (isLoading && groupedEvents.length === 0) {
    return (
      <div
        className={styles.loadingContainer}
        role="status"
        aria-label="Loading calendar events"
      >
        <Spinner label="Loading calendar events" />
      </div>
    );
  }

  return (
    <MainLayout>
      <div className={styles.pageContent}>
        <div className={styles.mainContent}>
          {error && (
            <ErrorBanner message={error} onRetry={handleSync} onDismiss={clearError} />
          )}
          <EventsList />
        </div>

        <aside className={styles.sidebar} aria-label="Create new event">
          <Suspense fallback={<Spinner label="Loading event form" />}>
            <CreateEventForm onSubmit={createEvent} disabled={isDisabled} />
          </Suspense>
        </aside>
      </div>
    </MainLayout>
  );
}

export default MainPage;
