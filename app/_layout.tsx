import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import AuthProvider from "@/context/AuthContect";
import { ThemeProvider, useAppTheme } from "@/context/ThemeContext";
import { Provider as PaperProvider } from "react-native-paper";

function LayoutWrapper() {

  const { theme } = useAppTheme();

  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen
          name="(public)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(private)"
          options={{ headerShown: false }}
        />
      </Stack>
      <StatusBar style="auto" />
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LayoutWrapper />
      </ThemeProvider>
    </AuthProvider>
  );
}
