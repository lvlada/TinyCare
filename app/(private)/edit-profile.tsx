import { useAuth } from "@/context/AuthContect";
import { useUser } from "@/hooks/useUser";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const SettingsScreen = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  const { user, loading: userLoading, updateUser } = useUser();
  const [isEditing, setIsEditing] = React.useState(false);
  const [fullName, setFullName] = React.useState("");
  const [city, setCity] = React.useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setCity(user.city || "");
    }
  }, [user]);

  const handleSignout = async () => {
    await signOut();
  };

  const handleSave = async () => {
    const trimmedFullName = fullName.trim();
    const trimmedCity = city.trim();

    if (!trimmedFullName || !trimmedCity) {
      Alert.alert("Greška", "Ime i prezime i Grad moraju biti popunjeni.");
      return;
    }

    if (trimmedFullName === user?.full_name && trimmedCity === user?.city) {
      Alert.alert("Obaveštenje", "Nema promena za čuvanje.");
      setIsEditing(false);
      return;
    }

    const result = await updateUser({
      full_name: trimmedFullName,
      city: trimmedCity,
    });

    if (result?.error) {
      Alert.alert("Greška pri čuvanju", result.error);
    } else {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFullName(user.full_name || "");
      setCity(user.city || "");
    }
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleBack = () => {
    router.push("/(private)/profile");
  };

  if (userLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={{ marginTop: 10, color: "#666" }}>
          Učitavanje podataka...
        </Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Korisnički podaci nisu dostupni.</Text>
        <Button title="Logout" onPress={handleSignout} color="#FF5252" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfo}>
        {isEditing ? (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ime i Prezime:</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Unesite ime i prezime"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Grad:</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="Unesite grad"
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Sačuvaj</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.buttonText}>Odustani</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.field}>
              <Text style={styles.label}>Ime i Prezime:</Text>
              <Text style={styles.value}>{user.full_name}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Grad:</Text>
              <Text style={styles.value}>{user.city}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{user.email}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Tip Korisnika:</Text>
              <Text style={styles.value}>{user.type}</Text>
            </View>

            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={handleEditToggle}
            >
              <Text style={styles.buttonText}>Uredi Profil</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <Button title="Back" onPress={handleBack} color="#000" />
      <Button title="Odjava" onPress={handleSignout} color="#FF5252" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  userInfo: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
    marginBottom: 4,
    fontWeight: "500",
  },
  value: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#4F46E5",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#10B981",
    flex: 1,
  },
  cancelButton: {
    backgroundColor: "#EF4444",
    flex: 1,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 16,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  errorText: {
    color: "#FF5252",
    fontSize: 16,
    textAlign: "center",
  },
  field: {
    marginBottom: 16,
  },
});

export default SettingsScreen;
