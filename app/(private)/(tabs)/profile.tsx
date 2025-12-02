import React, { useContext } from 'react';
import { View, StyleSheet, Image} from 'react-native';
import {
  Avatar,
  Text,
  Button,
  Surface,
  List,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContect'; 

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { signOut } = useAuth();


  const user = {
    name: 'Vladimir Lukić',
    email: 'vladimir@example.com',
    role: 'Parent', 
    joined: 'Jan 8, 2025',
  };

  const handleEdit = () => {
    //router.push('/(private)/settings'); // ili edit profil screen
  };


  const handleLogout = async () => {
    await signOut();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top surface with avatar/logo */}
      <Surface style={styles.headerSurface}>
        {/* pokušaj da učitaš avatar iz assets, fallback na Avatar.Icon ako nema */}
        <View style={styles.avatarWrap}>
          <Image
            source={require('../../../assets/images/baby_halo_logo.png')}
            style={styles.avatarImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.headerText}>
          <Text variant="headlineSmall" style={styles.name}>
            {user.name}
          </Text>
          <Text variant="bodyMedium" style={styles.role}>
            {user.role}
          </Text>
        </View>
      </Surface>

      {/* Info card */}
      <Surface style={styles.infoCard}>
        <List.Item
          title="Email"
          description={user.email}
          left={(props) => <List.Icon {...props} icon="email" />}
        />
        <List.Item
          title="Role"
          description={user.role}
          left={(props) => <List.Icon {...props} icon="account-circle" />}
        />
        <List.Item
          title="Joined"
          description={user.joined}
          left={(props) => <List.Icon {...props} icon="calendar" />}
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
          //onPress={() => router.push('/(private)/settings')}
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
    justifyContent: 'flex-start',
  },
  headerSurface: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    elevation: 4, // soft shadow
    backgroundColor: '#F3E8FF', // pastel lavender-ish header
    marginBottom: 20,
  },
  avatarWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    backgroundColor: '#FFF7ED', // pastel peach circle behind logo
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
    fontWeight: '700',
    color: '#111827',
  },
  role: {
    marginTop: 4,
    color: '#6B7280',
  },
  infoCard: {
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    overflow: 'hidden',
  },
  actions: {
    marginTop: 8,
    gap: 12, // newer RN supports gap; if not, use marginBottom on buttons
  },
  actionButton: {
    borderRadius: 24,
    marginBottom: 12,
  },
  actionContent: {
    paddingVertical: 10,
  },
  logoutButton: {
    backgroundColor: '#FFD6E0', // pastel pink for logout (noticeable)
  },
});
