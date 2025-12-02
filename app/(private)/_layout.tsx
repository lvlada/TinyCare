import { Redirect, Stack } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { useAuth } from "@/context/AuthContect"; 

export default function PrivateLayout() {
  const { session, loading } = useAuth(); 

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Checking authentication...</Text>
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(public)/login" />;
  }

  return (
    <Stack 
      screenOptions={{ 
        headerShown: false 
      }}
    >
      <Stack.Screen 
        name="(tabs)" 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="[id]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}