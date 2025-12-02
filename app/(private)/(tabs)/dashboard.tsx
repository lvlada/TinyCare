import React from "react";
import { View, StyleSheet, Image, FlatList } from "react-native";
import { Text, Surface, Button, useTheme, Avatar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function DashboardScreen() {
  const theme = useTheme();
  const router = useRouter();

  const babysiters = [
    {
      id: "1",
      name: "Anna Smith",
      rating: 4.9,
      available: "Dec 1, 2 PM - 6 PM",
    },
    {
      id: "2",
      name: "Lucas Brown",
      rating: 4.8,
      available: "Dec 2, 10 AM - 3 PM",
    },
    {
      id: "3",
      name: "Sophia White",
      rating: 5.0,
      available: "Dec 3, 1 PM - 5 PM",
    },
    {
      id: "4",
      name: "Oliver Green",
      rating: 4.7,
      available: "Dec 4, 9 AM - 12 PM",
    },
    {
      id: "5",
      name: "Emma Johnson",
      rating: 4.9,
      available: "Dec 5, 2 PM - 6 PM",
    },
    {
      id: "6",
      name: "Liam Davis",
      rating: 4.6,
      available: "Dec 6, 10 AM - 2 PM",
    },
    {
      id: "7",
      name: "Ava Wilson",
      rating: 5.0,
      available: "Dec 7, 1 PM - 5 PM",
    },
    {
      id: "8",
      name: "Noah Miller",
      rating: 4.8,
      available: "Dec 8, 3 PM - 7 PM",
    },
  ];

  const renderItem = ({ item }: any) => (
    <Surface style={styles.card}>
      <View style={styles.cardRow}>
        <Avatar.Text
          size={50}
          label={item.name
            .split(" ")
            .map((n: string) => n[0])
            .join("")}
          style={styles.avatar}
        />
        <View style={styles.cardInfo}>
          <Text variant="titleMedium" style={styles.name}>
            {item.name}
          </Text>
          <Text variant="bodySmall" style={styles.info}>
            Rating: {item.rating}
          </Text>
          <Text variant="bodySmall" style={styles.info}>
            Available: {item.available}
          </Text>
        </View>
      </View>
      <Button
        mode="contained"
        style={styles.button}
        contentStyle={styles.buttonContent}
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.header}>
        <Image
          source={require("../../../assets/images/baby_halo_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text variant="headlineSmall" style={styles.greeting}>
          Hello, Vladimir!
        </Text>
        <Text variant="bodyMedium" style={styles.subtext}>
          Browse available Babysiters
        </Text>
      </View>

      {/* FLATLIST */}
      <FlatList
        data={babysiters}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
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
  greeting: {
    fontWeight: "700",
    color: "#4F46E5",
  },
  subtext: {
    color: "#6B7280",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#FFF7ED",
    marginBottom: 16,
    elevation: 4,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    backgroundColor: "#BEECCF",
  },
  cardInfo: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontWeight: "600",
    marginBottom: 4,
  },
  info: {
    color: "#6B7280",
  },
  button: {
    borderRadius: 24,
    backgroundColor: "#BEECCF",
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
