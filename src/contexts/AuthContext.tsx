import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebase";

// A fake user object for bypass/demo mode so all components work without Firebase auth
const DEMO_USER = {
  uid: "demo-user-001",
  email: "demo@cold-chain-wise.com",
  displayName: "Demo User",
} as unknown as User;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setDemoMode: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  setDemoMode: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if demo mode was previously activated (persists across navigation)
    const isDemoMode = sessionStorage.getItem("demo_mode") === "true";
    if (isDemoMode) {
      setUser(DEMO_USER);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const setDemoMode = () => {
    sessionStorage.setItem("demo_mode", "true");
    setUser(DEMO_USER);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setDemoMode }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
