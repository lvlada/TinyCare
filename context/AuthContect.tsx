import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/auth-js";

// Definišemo tip za podatke korisnika koje prosleđujemo pri registraciji
// Ovo obezbeđuje bolju tipsku sigurnost.
type UserProfileData = {
  full_name: string;
  city: string;
  type: 'parent' | 'babysitter'; // Koristimo specifične literale za bolju kontrolu
}

type AuthContextType = {
  signOut: () => Promise<void>;
  signUp: (
    email: string,
    password: string,
    profileData: UserProfileData // Objedinjujemo dodatne podatke u jedan objekat
  ) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  session: Session | null;
  loading: boolean;
};
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  const getSesssion = async () => {
    // Bolja praksa je korišćenje try/catch bloka za asinkrone operacije
    try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session ?? null);
    } catch (error) {
        console.error("Greška pri dobijanju Supabase sesije:", error);
        setSession(null); // Osiguravamo da je sesija null u slučaju greške
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    getSesssion();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  // AŽURIRANA SIGN UP METODA
  const signUp: AuthContextType["signUp"] = async (
    email,
    password,
    { full_name, city, type } // Destrukturiranje objekta UserProfileData
  ) => {
    // 1. Supabase Autentifikacija
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (authError) {
        return { error: authError.message };
    }
    
    // Proveravamo da li je korisnik uspešno kreiran u auth tabeli
    const userId = authData?.user?.id;
    if (!userId) {
        // Ovo bi trebalo da bude retko, ali je dobra provera
        return { error: "Korisnik je kreiran, ali ID nije dostupan." };
    }

    // 2. Upis dodatnih podataka u "users" tabelu
    const { error: userError } = await supabase
      .from("users")
      .insert({
        id: userId,
        email: email, 
        full_name: full_name,
        city: city,
        type: type
      });
      
    if (userError) {
        // !!! KRITIČNA OBRADA GREŠKE !!!
        // Ako upis u 'users' tabelu ne uspe, idealno bi bilo obrisati korisnika
        // iz 'auth.users' tabele da bi se izbegle "zalutale" registracije.
        console.error("Greška pri upisu podataka u 'users' tabelu:", userError);
        
        // POKUŠAJ BRISANJA KORISNIKA IZ SUPABASE AUTH
        // Napomena: Za brisanje korisnika sa serverske strane (PostgreSQL),
        // moraš imati odgovarajuće RLS politike ili implementirati Edge funkciju/Trigger.
        // U klijentskom kodu, Supabase ovo dozvoljava samo ako je RLS pravilno podešen
        // (npr. da korisnik može obrisati samog sebe, ali pošto je registracija neuspešna,
        // trenutna sesija ne može da obriše korisnika. Zato ovo ostaje kao NAPOMENA).
        
        // Za sada, samo vraćamo poruku o grešci.
        return { error: userError.message };
    }
    
    // Sve uspešno
    return {};
  };

  const signIn: AuthContextType["signIn"] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error?.message };
  };
  return (
    <AuthContext.Provider value={{ signOut, signUp, signIn, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within the AuthProvider");
  }
  return context;
};