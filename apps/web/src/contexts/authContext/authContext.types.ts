import type { ReactNode } from "react";

import type { User } from "@app-types/auth";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export type { AuthContextValue, AuthProviderProps };
