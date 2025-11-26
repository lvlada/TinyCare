import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, TextInput, Button, Surface, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { black } from "react-native-paper/lib/typescript/styles/themes/v2/colors";

export default function SignupScreen() {
  const router = useRouter();
  const theme = useTheme();

  const [role, setRole] = useState<"parent" | "babysitter">("parent");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.container}>

        {/* LOGO */}
        <View style={styles.logoWrap}>
          <Image
            source={require("../../assets/images/baby_halo_logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* SIGNUP CARD */}
        <Surface style={styles.card}>
          <Text variant="headlineSmall" style={styles.title}>
            Create an Account
          </Text>

          <View style={styles.roleRow}>
            <Button
              mode={role === "parent" ? "contained" : "outlined"}
              onPress={() => setRole("parent")}
              style={styles.roleButton}
              contentStyle={styles.roleContent}
            >
              Parent
            </Button>

            <Button
              mode={role === "babysitter" ? "contained" : "outlined"}
              onPress={() => setRole("babysitter")}
              style={styles.roleButton}
              contentStyle={styles.roleContent}
            >
              Babysitter
            </Button>
          </View>

          <TextInput label="Full Name" mode="outlined" style={styles.input} />
          <TextInput
            label="Email"
            mode="outlined"
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            label="Confirm Password"
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          <Button
            mode="contained"
            style={styles.signupButton}
            contentStyle={styles.signupContent}
            labelStyle={{ color: '#083286ff', fontWeight: 'bold' }}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24
  },

  logoWrap: {
    alignItems: "center",
    marginBottom: -20,         // 🔥 podiže karticu ka vrhu
    marginTop: -20,            // 🔥 diže logo
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

  roleContent: {
    paddingVertical: 8,
  },

  input: {
    marginBottom: 12,
  },

  signupButton: {
    borderRadius: 24,
    marginTop: 4,
    backgroundColor: "#BEECCF",
  },

  signupContent: {
    paddingVertical: 10,
  },

  loginLinkWrap: {
    marginTop: 10,
    alignItems: "center",
  },
});
