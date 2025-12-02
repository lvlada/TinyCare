import React from "react";
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
import { useAppTheme } from "@/context/ThemeContext";

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const theme = useTheme();

  const { isDarkTheme, toggleTheme } = useAppTheme();

  const handleLogout = async () => {
    await signOut();
  };

  const handleBack = () => {
    router.push("/(private)/profile");
  };

  const themedStyles = getThemedStyles(theme);

  return (
    <SafeAreaView style={[themedStyles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={themedStyles.container}>
        <Text
          variant="headlineMedium"
          style={[themedStyles.title, { color: theme.colors.onBackground }]}
        >
          Podešavanja
        </Text>

        {/* Tema */}
        <Surface style={[themedStyles.card, { backgroundColor: theme.colors.surface }]}>
          <List.Item
            title="Tamna Tema (Dark Mode)"
            description="Prebaci se na svetlu ili tamnu temu"
            left={(props) => (
              <List.Icon
                {...props}
                icon={isDarkTheme ? "moon-waning-gibbous" : "white-balance-sunny"}
                color={theme.colors.primary}
              />
            )}
            right={() => (
              <Switch
                value={isDarkTheme}
                onValueChange={toggleTheme}
                color={theme.colors.primary}
              />
            )}
            style={themedStyles.listItem}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          />
        </Surface>

        <Surface style={[themedStyles.card, { backgroundColor: theme.colors.surface }]}>
          <List.Item
            title="Obaveštenja"
            description="Upravljajte postavkama notifikacija"
            left={(props) => <List.Icon {...props} icon="bell-outline" color={theme.colors.onSurfaceVariant} />}
            style={themedStyles.listItem}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          />

          <List.Item
            title="Sigurnost"
            description="Promena lozinke i biometrija"
            left={(props) => <List.Icon {...props} icon="lock-outline" color={theme.colors.onSurfaceVariant} />}
            style={themedStyles.listItem}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant  }}
          />
        </Surface>

        <View style={themedStyles.footer}>
          <Button
            mode="contained"
            onPress={handleLogout}
            style={themedStyles.button} 
            contentStyle={themedStyles.buttonContent}
            buttonColor={theme.colors.error} 
            textColor={theme.colors.onError} 
          >
            Logout
          </Button>

          <Button
            mode="outlined"
            onPress={handleBack}
            style={themedStyles.button} 
            contentStyle={themedStyles.buttonContent}
            textColor={theme.colors.onBackground}u
            theme={{ colors: { outline: theme.colors.outline } }} 
          >
            Back
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}


const getThemedStyles = (theme) => StyleSheet.create({
    safe: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 20,
    },
    title: {
        marginBottom: 16,
        fontWeight: "700",
    },

    card: {
        borderRadius: 14,
        elevation: 2,
        shadowColor: theme.colors.shadow,
        marginBottom: 16,
        overflow: "hidden",
    },

    listItem: {
        paddingVertical: 8,
        paddingHorizontal: 6,
    },

    footer: {
        marginTop: "auto",
        alignItems: "center",
        paddingBottom: 20,
    },

    button: {
        width: "50%",
        maxWidth: 360,
        borderRadius: 26,
        marginBottom: 12,
    },

    buttonContent: {
        paddingVertical: 10,
    },
    
});