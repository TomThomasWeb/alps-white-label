"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";

export type PortalUser = {
  id: string;
  auth_id: string;
  client_id: string | null;
  name: string;
  email: string;
  role: "admin" | "client-admin" | "client-user";
  avatar_initials: string | null;
};

export function useUser() {
  const [user, setUser] = useState<PortalUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function getUser() {
      try {
        console.log("[useUser] Getting auth user...");
        const { data: authData, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          console.error("[useUser] Auth error:", authError);
          setError("Auth error: " + authError.message);
          setLoading(false);
          return;
        }

        const authUser = authData?.user;
        if (!authUser) {
          console.log("[useUser] No auth user found");
          setError("Not logged in");
          setLoading(false);
          return;
        }

        console.log("[useUser] Auth user found:", authUser.id, authUser.email);

        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("auth_id", authUser.id)
          .single();

        if (profileError) {
          console.error("[useUser] Profile query error:", profileError);
          setError("Profile error: " + profileError.message + " (code: " + profileError.code + ")");
          setLoading(false);
          return;
        }

        if (!profile) {
          console.error("[useUser] No profile found for auth_id:", authUser.id);
          setError("No profile found. Run the SQL to create your user row.");
          setLoading(false);
          return;
        }

        console.log("[useUser] Profile loaded:", profile.name, profile.role);
        setUser(profile as PortalUser);
        setLoading(false);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[useUser] Unexpected error:", err);
        setError("Unexpected: " + message);
        setLoading(false);
      }
    }

    getUser();
  }, []);

  return {
    user,
    loading,
    error,
    isAdmin: user?.role === "admin",
    isClientAdmin: user?.role === "client-admin",
    isClientUser: user?.role === "client-user",
  };
}
