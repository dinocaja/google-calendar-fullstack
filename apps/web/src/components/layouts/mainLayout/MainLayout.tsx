import { useEventsContext } from "@contexts/eventsContext";
import { useAuthContext } from "@contexts/authContext";
import Button from "@shared/button";
import Typography from "@shared/typography";

import RangeSelector from "@pages/mainPage/components/rangeSelector";

import type { MainLayoutProps } from "./mainLayout.types";

import styles from "./mainLayout.module.scss";

function MainLayout({ children }: MainLayoutProps) {
  const { logout, user } = useAuthContext();
  const { range, setRange, syncEvents, isSyncing } = useEventsContext();

  const handleSync = async () => {
    await syncEvents();
  };

  const handleLogout = async () => {
    await logout();
  };

  const isDisabled = isSyncing;

  return (
    <div className={styles.container}>
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>

      <header className={styles.header} role="banner">
        <div className={styles.headerLeft}>
          <div className={styles.headerContent}>
            <Typography variant="h1" className={styles.title}>
              My Calendar
            </Typography>
            {user?.name && (
              <Typography variant="caption" className={styles.userName}>
                Logged in as {user.name}
              </Typography>
            )}
          </div>
          <RangeSelector value={range} onChange={setRange} disabled={isDisabled} />
        </div>
        <nav className={styles.headerActions} aria-label="Calendar actions">
          <Button
            onClick={handleSync}
            disabled={isDisabled}
            isLoading={isSyncing}
            aria-label={isSyncing ? "Syncing events from Google Calendar" : "Refresh events from Google Calendar"}
          >
            {isSyncing ? "Syncing..." : "Refresh"}
          </Button>
          <Button
            onClick={handleLogout}
            variant="secondary"
            aria-label="Sign out of your account"
          >
            Logout
          </Button>
        </nav>
      </header>

      <main
        id="main-content"
        className={styles.content}
        role="main"
        aria-label="Main content"
      >
        {children}
      </main>
    </div>
  );
}

export default MainLayout;
