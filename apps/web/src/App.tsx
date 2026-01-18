import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthProvider from "@contexts/authContext";
import { EventsProvider } from "@contexts/eventsContext";
import ProtectedRoute from "@shared/protectedRoute";
import Spinner from "@shared/spinner";

const LoginPage = lazy(() => import("@pages/loginPage"));
const MainPage = lazy(() => import("@pages/mainPage"));

function PageLoader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
      role="status"
      aria-label="Loading page"
    >
      <Spinner />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <EventsProvider>
                    <MainPage />
                  </EventsProvider>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
