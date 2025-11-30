// app/(public)/home.tsx
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, Surface, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/baby_halo_logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </Surface>

      <Text variant="headlineLarge" style={styles.title}>
        TinyCare
      </Text>

      <Text variant="bodyMedium" style={styles.subtext}>
        Trusted childcare, anytime.
      </Text>

      <Button
        mode="contained"
        style={styles.ctaButton}
        contentStyle={styles.ctaContent}
        onPress={() => router.push('/(public)/login')}
        labelStyle={styles.ctaLabel}
      >
        Continue →
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
    backgroundColor: '#FFE5D9',
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4F46E5', 
  },
  subtext: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#6B7280', 
  },
  ctaButton: {
    borderRadius: 24,
    elevation: 3, 
    backgroundColor: '#E6E0F8', 
  },
  ctaContent: {
    paddingVertical: 8,
    paddingHorizontal: 32,
  },
    ctaLabel: {
    color: '#083286ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
