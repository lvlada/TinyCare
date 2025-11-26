// app/(public)/home.tsx
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, Surface, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function Dashboard() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>


      <Text variant="headlineLarge" style={styles.title}>
       Dashboard
      </Text>

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
    elevation: 4, // soft shadow
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFE5D9', // pastel peach, možeš promeniti u lavender #E6E0F8
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4F46E5', // pastelna ljubičasta za kontrast
  },
  subtext: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#6B7280', // pastel siva
  },
  ctaButton: {
    borderRadius: 24,
    elevation: 3, // soft shadow
    backgroundColor: '#A3E635', // pastel mint ili promeni po želji
  },
  ctaContent: {
    paddingVertical: 8,
    paddingHorizontal: 32,
  },
});
