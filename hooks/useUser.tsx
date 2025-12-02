import { useAuth } from "@/context/AuthContect";
import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";


type DatabaseUser = {
  id: string;
  email: string;
  full_name: string; 
  city: string;       
  type: 'parent' | 'babysitter'; 
  created_at?: string;
} | null;


type UpdateUserData = {
    full_name?: string;
    city?: string;
    type?: 'parent' | 'babysitter';
}

export const useUser = () => {
  const [user, setUser] = useState<DatabaseUser>(null);
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();

  const userId = session?.user?.id || null;

  const fetchUser = useCallback(async () => {
    console.log("🔍 fetchUser called with userId:", userId);

    if (!userId) {
      setUser(null);
      return;
    }

    setLoading(true); 

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("❌ Error fetching user:", error);
        setUser(null);
      } else {
        console.log("✅ User fetched successfully:", data);
        setUser(data as DatabaseUser); 
      }
    } catch (err) {
      console.error("❌ Exception in fetchUser:", err);
      setUser(null);
    } finally {
        setLoading(false); 
    }
  }, [userId]);

  const updateUser = async (updates: UpdateUserData) => {
    if (!userId) {
      return { error: "Korisnik nije prijavljen." };
    }
  
    if (Object.keys(updates).length === 0) {
        return { error: "Nema podataka za ažuriranje." };
    }
    
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("users")
        .update(updates) 
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        console.error("❌ Error updating user:", error);
        setLoading(false);
        return { error: error.message };
      } else {
        console.log("✅ User updated successfully:", data);
        setUser(data as DatabaseUser);
        setLoading(false);
        return {}; 
      }
    } catch (e) {
      console.error("❌ Exception in updateUser:", e);
      setLoading(false);
      return { error: "Došlo je do neočekivane greške." };
    }
  };

useEffect(() => {
  if (!userId) {
    setUser(null);
    setLoading(false);
    return;
  }

  fetchUser();
}, [fetchUser, userId]);

  return { user, refetch: fetchUser, loading, updateUser };
};