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


  const themedStyles = getThemedStyles(theme);

  if (userLoading) {
    return (
      <View style={themedStyles.loadingContainer}>
        <ActivityIndicator
          animating={true}
          size="large"
          color={theme.colors.primary}
        />
        <Text style={{ marginTop: 10, color: theme.colors.onSurfaceVariant }}>
          Učitavanje profila...
        </Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={themedStyles.loadingContainer}>
        <Text style={{ color: theme.colors.onSurface }}>
          Korisnički podaci nisu dostupni. Pokušajte ponovo ili se ponovo
          prijavite.
        </Text>
        <Button
          mode="contained"
          onPress={handleLogout}
          style={{ marginTop: 20 }}
          buttonColor={theme.colors.error}
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
    <SafeAreaView style={themedStyles.safe}>
      <View style={themedStyles.container}>
        <Surface style={themedStyles.headerSurface} elevation={2}>
          <View style={themedStyles.avatarWrap}>
            <Image
              source={require("../../../assets/images/baby_halo_logo.png")}
              style={themedStyles.avatarImage}
              resizeMode="contain"
            />
          </View>

          <View style={themedStyles.headerText}>
            <Text variant="headlineSmall" style={themedStyles.name}>
              {profile.name}
            </Text>
            <Text variant="bodyMedium" style={themedStyles.role}>
              {profile.role}
            </Text>
          </View>
        </Surface>


        <Surface style={themedStyles.infoCard} elevation={2}>
          <List.Item
            title="Email"
            description={profile.email}
            left={(props) => <List.Icon {...props} icon="email" color={theme.colors.primary} />}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          />
          <List.Item
            title="Role"
            description={profile.role}
            left={(props) => <List.Icon {...props} icon="account-circle" color={theme.colors.primary} />}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          />
          <List.Item
            title="Joined"
            description={profile.joined}
            left={(props) => <List.Icon {...props} icon="calendar" color={theme.colors.primary} />}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          />
          <List.Item
            title="City"
            description={user.city || "N/A"}
            left={(props) => <List.Icon {...props} icon="city" color={theme.colors.primary} />}
            titleStyle={{ color: theme.colors.onSurface }}
            descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
          />
        </Surface>

        <View style={themedStyles.actions}>
          <Button
            mode="outlined"
            onPress={handleEdit}
            style={themedStyles.actionButton}
            contentStyle={themedStyles.actionContent}
            textColor={theme.colors.primary} 
            theme={{ colors: { outline: theme.colors.primary } }} 
          >
            Edit Profile
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.push('/(private)/settings')}
            style={themedStyles.actionButton}
            contentStyle={themedStyles.actionContent}
            textColor={theme.colors.primary}
            theme={{ colors: { outline: theme.colors.primary } }}
          >
            Settings
          </Button>

          <Button
            mode="contained"
            onPress={handleLogout}
            style={themedStyles.actionButton}
            contentStyle={themedStyles.actionContent}
            buttonColor={theme.colors.error} 
            textColor={theme.colors.onError}
          >
            Logout
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}


const getThemedStyles = (theme) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  headerSurface: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    backgroundColor: theme.colors.primaryContainer, 
    marginBottom: 20,
  },
  avatarWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    backgroundColor: theme.colors.surfaceVariant,
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
    color: theme.colors.onPrimaryContainer,
  },
  role: {
    marginTop: 4,
    color: theme.colors.onSurfaceVariant,
  },
  infoCard: {
    borderRadius: 12,
    elevation: 2,
    backgroundColor: theme.colors.surface,
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

});