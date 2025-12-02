import React, { useState } from "react";
import { View, StyleSheet, Image, Text, Pressable, Alert } from "react-native";
import { 
  TextInput, 
  Button, 
  Surface, 
  useTheme,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContect";

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { signIn } = useAuth();

  const [role, setRole] = useState<"parent" | "babysiter">("parent");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert("Greška", "Popunite sva polja.");
      return;
    }
    if (!trimmedEmail.includes("@")) {
      Alert.alert("Greška", "Unesite validnu email adresu.");
      return;
    }

    const { error } = await signIn(trimmedEmail, trimmedPassword);

    if (error) {
        Alert.alert("Greška pri prijavi", error);
        return; 
    }

    router.replace("/(private)/(tabs)/home");
  };

  const handleSignup = () => {
    router.push("/(public)/signup");
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/baby_halo_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.roleContainer}>
        <Button
          mode={role === "parent" ? "contained" : "outlined"}
          onPress={() => setRole("parent")}
          style={[styles.roleButton, role === "parent" && styles.activeButton]}
          contentStyle={styles.roleContent}
        >
          PARENT
        </Button>
        <Button
          mode={role === "babysiter" ? "contained" : "outlined"}
          onPress={() => setRole("babysiter")}
          style={[
            styles.roleButton,
            role === "babysiter" && styles.activeButton,
          ]}
          contentStyle={styles.roleContent}
        >
          BABYSITER
        </Button>
      </View>

      <Surface style={styles.formContainer}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.loginButton}
          contentStyle={styles.loginContent}
        >
          Login
        </Button>
      </Surface>
      <View style={{ alignItems: 'center', marginTop: 16 }}>
        <Pressable onPress={handleSignup}>
          <Text style={{ color: "#083286ff", textDecorationLine: "underline", flex:1 }}>
            Dont have an account, go to Signup
          </Text>
        </Pressable>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 44,
    justifyContent: "flex-start",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 240,
    height: 240,
    marginBottom: -50,
  },
  roleContainer: {
    flexDirection: "row",
    marginBottom: 32,
  },
  roleButton: {
    flex: 1,
    borderRadius: 24,
    marginHorizontal: 4,
  },
  roleContent: {
    paddingVertical: 5,
  },
  activeButton: {
    elevation: 3,
  },
  formContainer: {
    padding: 24,
    borderRadius: 16,
    elevation: 3,
    backgroundColor: "#FFF5F5",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "white",
  },
  loginButton: {
    borderRadius: 24,
  },
  loginContent: {
    paddingVertical: 8,
  },
});