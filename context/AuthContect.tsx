import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/auth-js";
import AsyncStorage from '@react-native-async-storage/async-storage'; 


const ASYNC_KEY = '@babysitters_data';

export type Babysitter = {
    id: string;
    full_name: string;
    city: string;
    type: 'parent' | 'babysitter';
    rating: number | null; 
};

export type UserProfile = {
  id: string; 
  full_name: string;
  city: string;
  type: 'parent' | 'babysitter';
  rating: number | null;
  has_seen_welcome: boolean; 
};

type UserProfileData = {
  full_name: string;
  city: string;
  type: 'parent' | 'babysitter'; 
}

export type AuthContextType = {
  signOut: () => Promise<void>;
  signUp: (
    email: string,
    password: string,
    profileData: UserProfileData 
  ) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  babysitters: Babysitter[];
  babysittersLoading: boolean;
  loadBabysitters: () => Promise<void>;
  hasSeenWelcome: boolean;
  welcomeLoading: boolean; 
  setWelcomeSeen: () => Promise<void>; 
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  const [babysitters, setBabysitters] = useState<Babysitter[]>([]);
  const [babysittersLoading, setBabysittersLoading] = useState(false);
  const [welcomeLoading, setWelcomeLoading] = useState(false); 

  // ----------------------------------------------------
  // LOGIKA ZA WELCOME FLAG 
  // ----------------------------------------------------

   const setWelcomeSeen = useCallback(async () => {
    if (!session?.user?.id) return;
       setWelcomeLoading(true); 

    try {
      const { error } = await supabase
        .from('users')
        .update({ has_seen_welcome: true }) 
        .eq('id', session.user.id);
      
      if (error) throw error;

      setUserProfile(prev => prev ? ({ ...prev, has_seen_welcome: true }) : null);

    } catch (e) {
      console.error("Greška pri postavljanju welcome flag-a u bazu:", e);
    } finally {
      setWelcomeLoading(false);
    }
  }, [session]); 


  // ----------------------------------------------------
  // LOGIKA ZA BABYSITTERE
  // ----------------------------------------------------

  const loadBabysitters = useCallback(async () => {
    setBabysittersLoading(true);

    try {
        const cachedData = await AsyncStorage.getItem(ASYNC_KEY);
        if (cachedData) {
            setBabysitters(JSON.parse(cachedData));
            setBabysittersLoading(false);
        }

        const { data, error } = await supabase
            .from("users")
            .select("id, full_name, city, type, rating") 
            .eq("type", "babysitter");

        if (error) {
            console.error("Greška pri dohvatanju Babysittera:", error);
        } else if (data) {
            const fetchedBabysitters = data as Babysitter[];
            setBabysitters(fetchedBabysitters);
            await AsyncStorage.setItem(ASYNC_KEY, JSON.stringify(fetchedBabysitters));
        }

    } catch (error) {
        console.error("Greška u loadBabysitters:", error);
    } finally {
        setBabysittersLoading(false);
    }
  }, []);


  // ----------------------------------------------------
  // LOGIKA ZA SESIJU I PROFIL (Ažuriramo select)
  // ----------------------------------------------------

  const getProfile = useCallback(async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id, full_name, city, type, rating, has_seen_welcome') 
            .eq('id', userId)
            .single();

        if (error && error.code !== 'PGRST116') { 
            throw error;
        }

        if (data) {
            setUserProfile(data as UserProfile);
        } else {
            setUserProfile(null);
        }
    } catch (error) {
        console.error("Greška pri dobijanju korisničkog profila:", error);
        setUserProfile(null);
    }
  }, []); 

  const getSesssion = async () => {
    try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session ?? null);
        
        if (data.session) {
            await getProfile(data.session.user.id);
        } else {
            setUserProfile(null);
        }
    } catch (error) {
        console.error("Greška pri dobijanju Supabase sesije:", error);
        setSession(null);
        setUserProfile(null);
    } finally {
        setLoading(false);
    }
  };
  
  useEffect(() => {
    getSesssion();
    loadBabysitters(); 

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession);

        if (newSession) {
            getProfile(newSession.user.id); 
        } else {
            setUserProfile(null);
        }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [getProfile, loadBabysitters]);


  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const signUp: AuthContextType["signUp"] = async (
    email,
    password,
    { full_name, city, type } 
  ) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (authError) {
        return { error: authError.message };
    }
    
    const userId = authData?.user?.id;
    if (!userId) {
        return { error: "Korisnik je kreiran, ali ID nije dostupan." };
    }


    const { error: userError } = await supabase
      .from("users")
      .insert({
        id: userId,
        email: email, 
        full_name: full_name,
        city: city,
        type: type,
        rating: null, 
        has_seen_welcome: false, 
      });
      
    if (userError) {
        console.error("Greška pri upisu podataka u 'users' tabelu:", userError);
        return { error: userError.message };
    }
    
    return {};
  };

  const signIn: AuthContextType["signIn"] = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (data.user) {
        await getProfile(data.user.id);
    }
    
    return { error: error?.message };
  };

  return (
    <AuthContext.Provider 
        value={{ 
            signOut, 
            signUp, 
            signIn, 
            session, 
            userProfile, 
            loading, 
            babysitters,
            babysittersLoading,
            loadBabysitters,
            hasSeenWelcome: userProfile?.has_seen_welcome ?? false, 
            welcomeLoading: welcomeLoading, 
            setWelcomeSeen 
        }}>
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