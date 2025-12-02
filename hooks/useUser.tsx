import { useAuth } from "@/context/AuthContect";
import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";


type DatabaseUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at?: string;
} | null;

export const useUser = () => {
  const [user, setUser] = useState<DatabaseUser>(null);
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();

  const userId = session?.user?.id || null;

  const fetchUser = useCallback(async () => {
    console.log("🔍 fetchUser called with userId:", userId);

    if (!userId) {
      console.log("❌ No userId, skipping fetch");
      setUser(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      console.log("📊 Query result:", { data, error });

      if (error) {
        console.error("❌ Error fetching user:", error);
        setUser(null);
      } else {
        console.log("✅ User fetched successfully:", data);
        setUser(data);
      }
    } catch (err) {
      console.error("❌ Exception in fetchUser:", err);
      setUser(null);
    }
  }, [userId]);

  const updateUser = async (firstName: string, lastName: string) => {
    if (!userId) {
      return;
    }
    setLoading(true);
    if (!firstName || !lastName) {
      return;
    }
    try {
      const { data, error } = await supabase
        .from("users")
        .update({
          first_name: firstName,
          last_name: lastName,
        })
        .eq("id", userId)
        .select()
        .single();

      if (!error) {
        setUser(data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("🔄 useEffect triggered, userId:", userId);
    if (userId) {
      fetchUser();
    } else {
      console.log("⚠️ No userId in useEffect");
    }
  }, [fetchUser, userId]);

  return { user, refetch: fetchUser, loading, updateUser };
};
