import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from "@/context/AuthContect";
import { useTheme, Text } from "react-native-paper";

export default function PrivateGate() {
  const { 
    hasSeenWelcome, 
    welcomeLoading, 
    loading: authLoading,
    session 
  } = useAuth();
  
  const theme = useTheme();

  if (authLoading || welcomeLoading) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ marginTop: 10, color: theme.colors.onBackground }}>Loading user data...</Text>
        </View>
    );
  }

  if (!session) {
    return <Redirect href="/(public)/login" />;
  }

  if (!hasSeenWelcome) {
    return <Redirect href="/(private)/welcome-screen" />;
  }
  
  return <Redirect href="/(tabs)/home" />;
}