import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { 
  Text, 
  TextInput, 
  Button, 
  Surface, 
  useTheme, 
  Snackbar 
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signupSchema, SignupSchema } from "@/schemas/signupSchema";
import { useAuth } from "@/context/AuthContect";

export default function SignupScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { signUp } = useAuth();

  const [role, setRole] = useState<"parent" | "babysitter">("parent");
  
  // Stanje za Snackbar
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const onDismissSnackBar = () => setVisible(false); 

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupSchema) => {
    const profileData = {
      full_name: data.full_name,
      city: data.city,
      type: role,
    };
    

    const { error } = await signUp(
      data.email,
      data.password,
      profileData
    );

    if (error) {
        console.error("Greška pri registraciji:", error);
        
        setErrorMessage(error);
        setVisible(true);
        return; 
    }

    router.push("/(public)/login");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.container}>

        <View style={styles.logoWrap}>
          <Image
            source={require("../../assets/images/baby_halo_logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Surface style={styles.card}>
          <Text variant="headlineSmall" style={styles.title}>
            Create an Account
          </Text>

          <View style={styles.roleRow}>
            <Button
              mode={role === "parent" ? "contained" : "outlined"}
              onPress={() => setRole("parent")}
              style={styles.roleButton}
            >
              Parent
            </Button>

            <Button
              mode={role === "babysitter" ? "contained" : "outlined"}
              onPress={() => setRole("babysitter")}
              style={styles.roleButton}
            >
              Babysitter
            </Button>
          </View>

          <TextInput
            label="Full Name"
            mode="outlined"
            style={styles.input}
            onChangeText={(text) => setValue("full_name", text)}
          />
          {errors.full_name && (
            <Text style={styles.error}>{errors.full_name.message}</Text>
          )}

          <TextInput
            label="Email"
            mode="outlined"
            keyboardType="email-address"
            style={styles.input}
            onChangeText={(text) => setValue("email", text)}
            autoCapitalize="none" 
            autoCorrect={false}
          />
          {errors.email && (
            <Text style={styles.error}>{errors.email.message}</Text>
          )}

          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry
            style={styles.input}
            onChangeText={(text) => setValue("password", text)}
          />
          {errors.password && (
            <Text style={styles.error}>{errors.password.message}</Text>
          )}

          <TextInput
            label="Confirm Password"
            mode="outlined"
            secureTextEntry
            style={styles.input}
            onChangeText={(text) => setValue("confirmPassword", text)}
          />
          {errors.confirmPassword && (
            <Text style={styles.error}>{errors.confirmPassword.message}</Text>
          )}

          <TextInput
            label="City"
            mode="outlined"
            style={styles.input}
            onChangeText={(text) => setValue("city", text)}
          />
          {errors.city && (
            <Text style={styles.error}>{errors.city.message}</Text>
          )}

          <Button
            mode="contained"
            style={styles.signupButton}
            contentStyle={styles.signupContent}
            labelStyle={{ color: "#083286ff", fontWeight: "bold" }}
            onPress={handleSubmit(onSubmit)}
          >
            Sign Up
          </Button>

          <View style={styles.loginLinkWrap}>
            <Text>Already have an account?</Text>
            <Button mode="text" onPress={() => router.push("/(public)/login")}>
              Log In
            </Button>
          </View>
        </Surface>
      </View>
      
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={5000} 
        action={{
          label: 'Zatvori',
          onPress: onDismissSnackBar,
        }}
        style={{ backgroundColor: '#D32F2F' }}
      >
        {errorMessage}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },

  logoWrap: {
    alignItems: "center",
    marginBottom: -20,
    marginTop: -20,
  },

  logo: {
    width: 240,
    height: 170,
  },

  card: {
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    backgroundColor: "#FFF7ED",
  },

  title: {
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "700",
    color: "#4F46E5",
  },

  roleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  roleButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 20,
  },

  input: {
    marginBottom: 8,
  },

  signupButton: {
    borderRadius: 24,
    marginTop: 6,
    backgroundColor: "#BEECCF",
  },

  signupContent: {
    paddingVertical: 10,
  },

  loginLinkWrap: {
    marginTop: 10,
    alignItems: "center",
  },

  error: {
    color: "red",
    marginBottom: 6,
    marginLeft: 4,
    fontSize: 13,
  },
});