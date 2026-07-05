import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authApi, tokenStore, type ApiUser } from "../services/api";

interface AuthContextType {
  user: ApiUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = "elearning-auth-user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? (JSON.parse(stored) as ApiUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  const value = useMemo<AuthContextType>(() => ({
    user,

    // Connexion réelle : POST /auth/login → { access_token, user }
    signIn: async (email, password) => {
      const res = await authApi.login(email, password);
      tokenStore.set(res.access_token);
      setUser(res.user);
    },

    // Inscription : POST /users/register puis connexion automatique
    signUp: async (firstName, lastName, email, password) => {
      await authApi.register(firstName, lastName, email, password);
      const res = await authApi.login(email, password);
      tokenStore.set(res.access_token);
      setUser(res.user);
    },

    signOut: () => {
      tokenStore.clear();
      setUser(null);
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
