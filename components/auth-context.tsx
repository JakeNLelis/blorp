"use client";

import * as React from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

interface AuthContextType {
  user: User | null;
  role: string | null;
  isLoading: boolean;
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  role: null,
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [role, setRole] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const supabase = React.useMemo(() => createClient(), []);

  React.useEffect(() => {
    let isMounted = true;

    async function fetchSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (session?.user) {
          const currentUser = session.user;
          setUser(currentUser);
          
          // Fetch profile role safely and concurrently without blocking the main user state
          try {
            const { data: profile, error } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", currentUser.id)
              .single();
            
            if (error) {
              console.error("Error fetching user profile:", error.message || error);
            }
            
            if (isMounted) {
              setRole(profile?.role || "user");
            }
          } catch (profileError) {
            console.error("Profiles database query failed:", profileError);
            if (isMounted) {
              setRole("user");
            }
          }
        } else {
          setUser(null);
          setRole(null);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        if (session?.user) {
          const currentUser = session.user;
          setUser(currentUser);
          
          try {
            const { data: profile, error } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", currentUser.id)
              .single();
            
            if (error) {
              console.error("Error updating user profile on auth state change:", error.message || error);
            }
            
            if (isMounted) {
              setRole(profile?.role || "user");
              setIsLoading(false);
            }
          } catch (profileError) {
            console.error("Profiles database query failed on auth state change:", profileError);
            if (isMounted) {
              setRole("user");
              setIsLoading(false);
            }
          }
        } else {
          setUser(null);
          setRole(null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ user, role, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}
