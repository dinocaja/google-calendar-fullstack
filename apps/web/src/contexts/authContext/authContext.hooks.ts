import { useContext } from "react";

import { AuthContext } from "./AuthContext";

function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }

  return context;
}

export { useAuthContext };
