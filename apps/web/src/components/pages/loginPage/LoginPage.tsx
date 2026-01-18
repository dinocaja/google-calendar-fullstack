import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "@contexts/authContext";
import Button from "@shared/button";
import Typography from "@shared/typography";

import styles from "./loginPage.module.scss";

function LoginPage() {
  const { login, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <main className={styles.container} role="main" aria-labelledby="login-title">
      <section className={styles.card} aria-label="Sign in form">
        <Typography variant="h1" className={styles.title} id="login-title">
          Google Calendar
        </Typography>
        <Typography variant="body" className={styles.subtitle}>
          Sign in to view your calendar events
        </Typography>
        <Button
          onClick={login}
          className={styles.loginButton}
          aria-label="Sign in with your Google account"
        >
          Sign in with Google
        </Button>
      </section>
    </main>
  );
}

export default LoginPage;
