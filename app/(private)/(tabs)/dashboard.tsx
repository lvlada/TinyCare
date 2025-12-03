import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, FlatList, ActivityIndicator } from "react-native";
import {
  Text,
  Surface,
  Button,
  useTheme,
  Avatar,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth, Babysitter as ContextBabysitter } from "@/context/AuthContect"; 

interface DashboardBabysitter extends ContextBabysitter {
  available: string;
}


export default function DashboardScreen() {
  const theme = useTheme();
  const router = useRouter();
  
  const { userProfile, babysitters: contextBabysitters, babysittersLoading, loadBabysitters } = useAuth();

  const firstName = userProfile?.full_name
    ? userProfile.full_name.split(" ")[0]
    : "User";

  const [searchText, setSearchText] = useState("");
  const [filteredBabysiters, setFilteredBabysiters] = useState<DashboardBabysitter[]>([]);

  const ALL_BABYSITTERS_FOR_DASHBOARD: DashboardBabysitter[] = contextBabysitters.map(b => ({
      ...b,
      rating: b.rating, 
      available: "Ask for availability", 
  }));

  const renderRatingDisplay = (rating: number | null) => {
    const value = rating ?? 0;
    
    if (value > 0) {
      const ratingText = value.toFixed(value % 1 !== 0 ? 1 : 0);
      return (
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          ⭐ Rating: {ratingText} 
        </Text>
      );
    }
    
    return (
      <Text
        variant="bodySmall"
        style={{ color: theme.colors.onSurfaceVariant }}
      >
        ⭐ Rating: N/A
      </Text>
    );
  };


  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredBabysiters([]);
    } else {
      const results = ALL_BABYSITTERS_FOR_DASHBOARD.filter((babysitter) =>
        babysitter.full_name.toLowerCase().includes(searchText.toLowerCase().trim())
      );
      setFilteredBabysiters(results);
    }
  }, [searchText, ALL_BABYSITTERS_FOR_DASHBOARD]);

  

  const renderItem = ({ item }: { item: DashboardBabysitter }) => ( 
    <Surface
      style={[
        styles.card,
        { backgroundColor: theme.colors.elevation.level1 },
      ]}
    >
      <View style={styles.cardRow}>
        <Avatar.Text
          size={50}
          label={item.full_name.split(" ").map((n) => n[0]).join("")}
          style={{ backgroundColor: theme.colors.secondaryContainer }}
          color={theme.colors.onSecondaryContainer}
        />

        <View style={styles.cardInfo}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            {item.full_name}
          </Text>
          
          {renderRatingDisplay(item.rating)}

          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Available: {item.available}
          </Text>
        </View>
      </View>

      <Button
        mode="contained"
        style={{
          borderRadius: 24,
          backgroundColor: theme.colors.primaryContainer,
        }}
        textColor={theme.colors.onPrimaryContainer}
        contentStyle={{ paddingVertical: 8 }}
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

        <Text
          variant="headlineSmall"
          style={{ color: theme.colors.primary, fontWeight: "700" }}
        >
          Hello, {firstName}!
        </Text>

        <Text
          variant="bodyMedium"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          Browse available Babysitters
        </Text>
      </View>

      <TextInput
        label="Search Babysitters by Name"
        mode="outlined"
        style={styles.searchInput}
        value={searchText}
        onChangeText={setSearchText}
        textColor={theme.colors.onSurface}
      />


      {babysittersLoading && searchText.trim() === "" ? (
        <View style={styles.noResultsContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ marginTop: 10, color: theme.colors.onSurfaceVariant }}>Loading Babysitters...</Text>
        </View>
      ) : filteredBabysiters.length > 0 ? (
        <FlatList
          data={filteredBabysiters}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Text
            style={{
              fontSize: 16,
              textAlign: "center",
              color: theme.colors.onSurfaceVariant,
            }}
          >
            {searchText.trim() === ""
              ? "Start typing a name to search for a Babysitter."
              : `No Babysitters found for '${searchText}'.`}
          </Text>

          {/* Opcionalno dodavanje dugmeta za ručno osvežavanje ako nema rezultata */}
          {contextBabysitters.length === 0 && searchText.trim() === "" && (
             <Button mode="outlined" onPress={loadBabysitters} style={{marginTop: 15}}>
                Retry Load
             </Button>
          )}
          
        </View>
      )}
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
  searchInput: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
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
  noResultsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
});