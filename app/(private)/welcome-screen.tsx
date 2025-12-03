import React from 'react';
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Text, Button, Surface, useTheme } from 'react-native-paper';
import { useRouter, Redirect } from 'expo-router';
import { useAuth } from "@/context/AuthContect";

export default function WelcomeScreenPostLogin() {
  const router = useRouter();
  const theme = useTheme();

 const { 
    setWelcomeSeen, 
    userProfile,
    hasSeenWelcome, 
    welcomeLoading 
  } = useAuth();
  
  const firstName = userProfile?.full_name?.split(" ")[0] || "there";

  const handleContinue = async () => {
    await setWelcomeSeen(); 
    router.replace('/(tabs)/home');
  };

  if (welcomeLoading) {
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center' }]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ marginTop: 10, color: theme.colors.onBackground }}>Loading...</Text>
        </View>
    );
  }
  if (hasSeenWelcome) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={[styles.logoContainer, { backgroundColor: theme.colors.primaryContainer }]}>
        <Image
          source={require('../../assets/images/baby_halo_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Surface>

      <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.primary }]}>
        Welcome, {firstName}!
      </Text>

      <Text variant="bodyMedium" style={[styles.subtext, { color: theme.colors.onSurfaceVariant }]}>
        You're all set! Find trusted babysitters near you and manage your bookings easily.
      </Text>

      <Button
        mode="contained"
        style={[styles.ctaButton, { backgroundColor: theme.colors.primary }]}
        contentStyle={styles.ctaContent}
        onPress={handleContinue}
        labelStyle={{ color: theme.colors.onPrimary, fontWeight: 'bold' }}
      >
        Start Browsing →
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginBottom: 32,
    elevation: 4, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtext: {
    textAlign: 'center',
    marginBottom: 32,
  },
  ctaButton: {
    borderRadius: 24,
    elevation: 3, 
  },
  ctaContent: {
    paddingVertical: 8,
    paddingHorizontal: 32,
  },
});