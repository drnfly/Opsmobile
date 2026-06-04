// Auth context: bootstrap from refresh token, login, logout.
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, setAccessToken, REFRESH_KEY } from "@/src/api/client";
import { storage } from "@/src/utils/storage";

export type Role = "admin" | "foreman" | "crew";
export type User = { id: string; email: string; name: string; role: Role };

type Ctx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthCtx = createContext<Ctx | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    try {
      const r = await storage.secureGet<string>(REFRESH_KEY, "");
      if (!r) {
        setUser(null);
        return;
      }
      const data = await api<{ access_token: string; refresh_token: string; user: User }>(
        "/auth/refresh",
        { method: "POST", body: JSON.stringify({ refresh_token: r }), auth: false },
      );
      setAccessToken(data.access_token);
      await storage.secureSet(REFRESH_KEY, data.refresh_token);
      setUser(data.user);
    } catch {
      await storage.secureRemove(REFRESH_KEY);
      setAccessToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = async (email: string, password: string) => {
    const data = await api<{ access_token: string; refresh_token: string; user: User }>(
      "/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }), auth: false },
    );
    setAccessToken(data.access_token);
    await storage.secureSet(REFRESH_KEY, data.refresh_token);
    setUser(data.user);
  };

  const logout = async () => {
    await storage.secureRemove(REFRESH_KEY);
    setAccessToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const u = await api<User>("/auth/me");
      setUser(u);
    } catch {}
  };

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthCtx.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
