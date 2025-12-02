import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Text,
  Button,
  List,
  useTheme,
  Switch,
  Surface,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useAuth } from "@/context/AuthContect";

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { signOut } = useAuth();

  const [isDarkTheme, setIsDarkTheme] = useState(theme.dark);

  const toggleTheme = () => setIsDarkTheme((prev) => !prev);

  const handleLogout = async () => {
    await signOut();
  };

  const handleBack = () => {
    router.push("/(private)/profile");
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={styles.container}>
        <Text
          variant="headlineMedium"
          style={[styles.title, { color: theme.colors.onBackground }]}
        >
          Podešavanja
        </Text>

        {/* Tema */}
        <Surface style={styles.card}>
          <List.Item
            title="Tamna Tema (Dark Mode)"
            description="Prebaci se na svetlu ili tamnu temu"
            left={(props) => (
              <List.Icon
                {...props}
                icon={isDarkTheme ? "moon-waning-gibbous" : "white-balance-sunny"}
              />
            )}
            right={() => (
              <Switch
                value={isDarkTheme}
                onValueChange={toggleTheme}
                color={theme.colors.primary}
              />
            )}
          />
        </Surface>

        {/* Ostale opcije */}
        <Surface style={styles.card}>
          <List.Item
            title="Obaveštenja"
            description="Upravljajte postavkama notifikacija"
            left={(props) => <List.Icon {...props} icon="bell-outline" />}
          />

          <List.Item
            title="Sigurnost"
            description="Promena lozinke i biometrija"
            left={(props) => <List.Icon {...props} icon="lock-outline" />}
          />
        </Surface>

        {/* Donja dugmad */}
        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={handleLogout}
            style={[styles.button, styles.logoutButton]}
            contentStyle={styles.buttonContent}
          >
            Logout
          </Button>

          <Button
            mode="outlined"
            onPress={handleBack}
            style={[styles.button, styles.backButton]}
            contentStyle={styles.buttonContent}
          >
            Back
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    marginBottom: 20,
    fontWeight: "700",
  },

  card: {
    borderRadius: 14,
    elevation: 2,
    marginBottom: 20,
  },

  footer: {
    marginTop: "auto",
    alignItems: "center",
    gap: 14,
    paddingBottom: 20,
  },

  button: {
    width: "50%",
    maxWidth: 300,
    borderRadius: 26,
  },

  buttonContent: {
    paddingVertical: 10,
  },

  logoutButton: {
    backgroundColor: "#FF5252",
  },

  backButton: {
    borderColor: "#B0BEC5",
  },
});
