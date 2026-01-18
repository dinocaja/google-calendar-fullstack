import { createContext, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { apiClient, API_BASE_URL } from "@utils/apiClient";
import { AUTH_ENDPOINTS } from "@constants/endpoints";
import type { User } from "@app-types/auth";
import type { ApiResponse } from "@app-types/api";

import type { AuthContextValue, AuthProviderProps } from "./authContext.types";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get<ApiResponse<User>>(AUTH_ENDPOINTS.ME);
      setUser(response.data);
    } catch (err) {
      setUser(null);
      if (err instanceof Error && !err.message.includes("401")) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(() => {
    window.location.href = `${API_BASE_URL}${AUTH_ENDPOINTS.GOOGLE}`;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
export default AuthProvider;
