import React from "react"; 
import { View, StyleSheet, Image, FlatList } from "react-native";
import { Text, Surface, Button, Avatar, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth, Babysitter } from "@/context/AuthContect"; 

export default function Home() {
  const theme = useTheme();
  const router = useRouter();
  
  const { userProfile, babysitters, babysittersLoading, loadBabysitters } = useAuth(); 

  const renderItem = ({ item }: { item: Babysitter }) => {
    
    const ratingValue = item.rating ?? 0;
    

    const renderRating = (rating: number) => {
        if (rating > 0) {
            const ratingText = rating.toFixed(rating % 1 !== 0 ? 1 : 0);
            return (
                <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.onSurfaceVariant }}
                >
                    ⭐ Rating: {ratingText}
                </Text>
            );
        } else {
            return (
                <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.onSurfaceVariant }}
                >
                    ⭐ Rating: N/A
                </Text>
            );
        }
    };


    return (
      <Surface
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
        elevation={2}
      >
        <View style={styles.cardRow}>
          <Avatar.Text
            size={50}
            label={item.full_name
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
            style={{ backgroundColor: theme.colors.secondaryContainer }}
            color={theme.colors.onSecondaryContainer}
          />

          <View style={styles.cardInfo}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              {item.full_name}
            </Text>
            
              {renderRating(ratingValue)}

            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              City: {item.city}
            </Text>
          </View>
        </View>

        <Button
          mode="contained"
          style={{
            borderRadius: 24,
            backgroundColor: theme.colors.primary,
          }}
          labelStyle={{ color: theme.colors.onPrimary }}
          onPress={() =>
            router.push({
              pathname: "/(private)/[id]",
              params: { id: item.id },
            })
          }
        >
          View Profile
        </Button>
      </Surface>
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <View style={styles.header}>
        <Image
          source={require("../../../assets/images/baby_halo_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text
          variant="headlineSmall"
          style={{ color: theme.colors.primary, fontWeight: "700" }}
        >
          Hello, {userProfile?.full_name}!
        </Text>

        <Text
          variant="bodyMedium"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          Browse available Babysitters
        </Text>
      </View>

      <FlatList
        data={babysitters}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshing={babysittersLoading}
        onRefresh={loadBabysitters}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: 12,
  },
  logo: {
    width: 240,
    height: 240,
    marginBottom: -50,
    marginTop: -40,
  },
  card: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardInfo: {
    marginLeft: 12,
    flex: 1,
  },
});