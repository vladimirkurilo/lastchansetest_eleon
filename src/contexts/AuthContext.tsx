
"use client";

import type { User } from "@/lib/types";
import { mockUsers } from "@/lib/mock-data";
import type { ReactNode } from "react";
import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: User | null;
  login: (email: string, role: 'guest' | 'admin') => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for an existing session
    const storedUser = localStorage.getItem("smartStayUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email: string, role: 'guest' | 'admin') => {
    // In a real app, you'd authenticate against a backend
    const foundUser = mockUsers.find(u => u.email === email && u.role === role);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("smartStayUser", JSON.stringify(foundUser));
    } else {
      // Simulate a generic user if not found in mock, for testing
      const genericUser: User = { id: Date.now().toString(), email, role };
      setUser(genericUser);
      localStorage.setItem("smartStayUser", JSON.stringify(genericUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("smartStayUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
