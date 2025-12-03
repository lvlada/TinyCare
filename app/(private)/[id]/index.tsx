import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import {
  Text,
  Surface,
  Avatar,
  useTheme,
  Button,
  IconButton,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import * as Linking from "expo-linking"; 


type BabysitterDetails = {
  id: string;
  full_name: string;
  city: string;
  type: "parent" | "babysitter";
  email: string;
  rating: number | null;
};

export default function BabysitterProfileScreen() {
  const theme = useTheme();
  const router = useRouter();

  const { id } = useLocalSearchParams();
  const babysitterId = id as string;

  const [babysitter, setBabysitter] = useState<BabysitterDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };


  const loadProfile = async () => {
    if (!babysitterId) {
      setError("No profile ID provided.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("users")
      .select("id, full_name, city, type, email, rating") 
      .eq("id", babysitterId)
      .single();

    if (error) {
      console.error("Greška pri dohvatanju profila:", error);
      setError("Error loading profile: " + error.message);
      setBabysitter(null);
    } else if (data) {
      if (data.type !== "babysitter") {
        setError("This user is not a babysitter.");
        setBabysitter(null);
      } else {
        setBabysitter(data as BabysitterDetails);
      }
    } else {
      setError("Profile not found.");
      setBabysitter(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, [babysitterId]);


  const renderRatingDisplay = (rating: number | null) => {
    const value = rating ?? 0;
    
    if (value > 0) {
      const ratingText = value.toFixed(value % 1 !== 0 ? 1 : 0);
      return (
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
          ⭐ {ratingText} / 5
        </Text>
      );
    }
    
    return (
      <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
        N/A
      </Text>
    );
  };


  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
            justifyContent: "center",
          },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 10, color: theme.colors.onBackground }}>
          Loading profile...
        </Text>
      </SafeAreaView>
    );
  }

  if (error || !babysitter) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
            justifyContent: "center",
            padding: 20,
          },
        ]}
      >
        <Text
          variant="titleMedium"
          style={{ color: theme.colors.error, textAlign: "center" }}
        >
          {error || "Profile not found."}
        </Text>
        <Button
          mode="outlined"
          onPress={() => router.back()}
          style={{ marginTop: 20 }}
        >
          Go Back
        </Button>
      </SafeAreaView>
    );
  }



  const avatarLabel = babysitter.full_name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface
          style={[
            styles.profileCard,
            { backgroundColor: theme.colors.surface },
          ]}
          elevation={3}
        >
          <View style={styles.avatarContainer}>
            <Avatar.Text
              size={120}
              label={avatarLabel}
              style={{ backgroundColor: theme.colors.primaryContainer }}
              color={theme.colors.onPrimaryContainer}
            />
            <Text
              variant="headlineMedium"
              style={[styles.name, { color: theme.colors.onSurface }]}
            >
              {babysitter.full_name}
            </Text>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              City: {babysitter.city}
            </Text>
          </View>

          <View
            style={[
              styles.detailItem,
              { borderBottomColor: theme.colors.outlineVariant },
            ]}
          >
            <Text
              variant="titleSmall"
              style={{ color: theme.colors.primary, marginBottom: 4 }}
            >
              ⭐ Rating:
            </Text>
            {renderRatingDisplay(babysitter.rating)}
          </View>

          <View
            style={[
              styles.detailItem,
              { borderBottomColor: theme.colors.outlineVariant },
            ]}
          >
            <Text
              variant="titleSmall"
              style={{ color: theme.colors.primary, marginBottom: 4 }}
            >
              Email:
            </Text>
            <View style={styles.emailRow}>
              <Text
                variant="bodyLarge"
                style={{ color: theme.colors.onSurface }}
              >
                {babysitter.email}
              </Text>
              <IconButton
                icon="email"
                iconColor={theme.colors.primary}
                size={20}
                onPress={() => handleEmailPress(babysitter.email)}
              />
            </View>
          </View>

          <View
            style={[
              styles.detailItem,
              {
                borderBottomColor: theme.colors.outlineVariant,
                borderBottomWidth: 0,
              },
            ]}
          >
            <Text
              variant="titleSmall"
              style={{ color: theme.colors.primary, marginBottom: 4 }}
            >
              Role:
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
              {babysitter.type === "babysitter"
                ? "Professional Babysitter"
                : "Unknown Role"}
            </Text>
          </View>

          <Button
            mode="contained"
            icon="message-text-outline"
            style={[
              styles.contactButton,
              { backgroundColor: theme.colors.tertiary },
            ]}
            labelStyle={{ color: theme.colors.onTertiary }}
            onPress={() => handleEmailPress(babysitter.email)} 
          >
            Contact {babysitter.full_name.split(" ")[0]}
          </Button>
        </Surface>

        <Button
          mode="text"
          onPress={() => router.back()}
          style={{ marginTop: 16 }}
        >
          Go back to Babysitters
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  scrollContent: {
    padding: 20,
    alignItems: "center",
    width: "100%",
  },
  profileCard: {
    width: "100%",
    maxWidth: 600,
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    width: "100%",
    borderBottomColor: "#E0E0E0",
  },
  name: {
    marginTop: 10,
    fontWeight: "700",
    textAlign: "center",
  },
  detailItem: {
    width: "100%",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  emailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contactButton: {
    marginTop: 30,
    paddingVertical: 8,
    borderRadius: 24,
    width: "90%",
  },
});