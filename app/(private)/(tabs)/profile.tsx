import { View, StyleSheet, Image } from "react-native";
import {
  Text,
  Button,
  Surface,
  List,
  useTheme,
  ActivityIndicator,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContect";
import { useUser } from "@/hooks/useUser";

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { signOut } = useAuth();

  const { user, loading: userLoading } = useUser();

  const handleEdit = () => {
    router.push("/(private)/edit-profile");
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (userLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator
          animating={true}
          size="large"
          color={theme.colors.primary}
        />
        <Text style={{ marginTop: 10 }}>Učitavanje profila...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text>
          Korisnički podaci nisu dostupni. Pokušajte ponovo ili se ponovo
          prijavite.
        </Text>
        <Button
          mode="contained"
          onPress={handleLogout}
          style={{ marginTop: 20 }}
        >
          Odjava
        </Button>
      </View>
    );
  }

  const joinedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : "N/A";
  const profile = {
    name: user.full_name || "Korisnik",
    email: user.email || "N/A",
    role: user.type || "N/A",
    joined: joinedDate,
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
    >
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Surface style={styles.headerSurface}>
          <View style={styles.avatarWrap}>
            <Image
              source={require("../../../assets/images/baby_halo_logo.png")}
              style={styles.avatarImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.headerText}>
            <Text variant="headlineSmall" style={styles.name}>
              {profile.name}
            </Text>
            <Text variant="bodyMedium" style={styles.role}>
              {profile.role}
            </Text>
          </View>
        </Surface>

        {/* Info card */}
        <Surface style={styles.infoCard}>
          <List.Item
            title="Email"
            description={profile.email}
            left={(props) => <List.Icon {...props} icon="email" />}
          />
          <List.Item
            title="Role"
            description={profile.role}
            left={(props) => <List.Icon {...props} icon="account-circle" />}
          />
          <List.Item
            title="Joined"
            description={profile.joined}
            left={(props) => <List.Icon {...props} icon="calendar" />}
          />
          <List.Item
            title="City"
            description={user.city || "N/A"}
            left={(props) => <List.Icon {...props} icon="city" />}
          />
        </Surface>

        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={handleEdit}
            style={styles.actionButton}
            contentStyle={styles.actionContent}
          >
            Edit Profile
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.push('/(private)/settings')}
            style={styles.actionButton}
            contentStyle={styles.actionContent}
          >
            Settings
          </Button>

          <Button
            mode="contained"
            onPress={handleLogout}
            style={[styles.actionButton, styles.logoutButton]}
            contentStyle={styles.actionContent}
          >
            Logout
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
  },
  loadingContainer: {
    // DODATO: stil za loading
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerSurface: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    elevation: 4,
    backgroundColor: "#F3E8FF",
    marginBottom: 20,
  },
  avatarWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    backgroundColor: "#FFF7ED",
    elevation: 2,
  },
  avatarImage: {
    width: 64,
    height: 64,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontWeight: "700",
    color: "#111827",
  },
  role: {
    marginTop: 4,
    color: "#6B7280",
  },
  infoCard: {
    borderRadius: 12,
    elevation: 2,
    backgroundColor: "#FFFFFF",
    marginBottom: 20,
    overflow: "hidden",
  },
  actions: {
    marginTop: 8,
    gap: 12,
  },
  actionButton: {
    borderRadius: 24,
    marginBottom: 12,
  },
  actionContent: {
    paddingVertical: 10,
  },
  logoutButton: {
    backgroundColor: "#FFD6E0",
  },
});
