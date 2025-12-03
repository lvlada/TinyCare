import { useAuth } from "@/context/AuthContect";
import { useUser } from "@/hooks/useUser";
import React, { useEffect } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import {
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  useTheme,
  Surface,
} from "react-native-paper";

const SettingsScreen = () => {

  const theme = useTheme();
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


  const themedStyles = getThemedStyles(theme);

  if (userLoading) {
    return (
      <SafeAreaView style={themedStyles.container}>
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          animating={true}
        />
        <Text style={themedStyles.loadingText}>
          Učitavanje podataka...
        </Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={themedStyles.container}>
        <Text style={themedStyles.errorText}>Korisnički podaci nisu dostupni.</Text>
        <Button
          mode="contained"
          onPress={handleSignout}
          buttonColor={theme.colors.error}
          style={{ marginTop: 20 }}
          labelStyle={{ fontWeight: 'bold' }} 
        >
          Logout
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={themedStyles.container}>
      <Surface style={themedStyles.userInfo} elevation={4}>
        {isEditing ? (
          <>
            <View style={themedStyles.inputGroup}>
              <Text style={themedStyles.label}>Ime i Prezime:</Text>
              <TextInput
                style={themedStyles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Unesite ime i prezime"
                mode="outlined"
                keyboardAppearance={theme.dark ? 'dark' : 'light'}
              />
            </View>

            <View style={themedStyles.inputGroup}>
              <Text style={themedStyles.label}>Grad:</Text>
              <TextInput
                style={themedStyles.input}
                value={city}
                onChangeText={setCity}
                placeholder="Unesite grad"
                mode="outlined"
                keyboardAppearance={theme.dark ? 'dark' : 'light'}
              />
            </View>

            <View style={themedStyles.buttonRow}>
              <Button
                mode="contained"
                onPress={handleSave}
                buttonColor={theme.colors.primary}
                style={themedStyles.flexButton}
                labelStyle={themedStyles.buttonText}
                contentStyle={themedStyles.buttonContent}
              >
                Sačuvaj
              </Button>

              <Button
                mode="contained"
                onPress={handleCancel}
                buttonColor={theme.colors.error}
                style={themedStyles.flexButton}
                labelStyle={themedStyles.buttonText}
                contentStyle={themedStyles.buttonContent}
              >
                Odustani
              </Button>
            </View>
          </>
        ) : (
          <>
            <View style={themedStyles.field}>
              <Text style={themedStyles.labelBold}>Full Name:</Text>
              <Text style={themedStyles.value}>{user.full_name}</Text>
            </View>

            <View style={themedStyles.field}>
              <Text style={themedStyles.labelBold}>City:</Text>
              <Text style={themedStyles.value}>{user.city}</Text>
            </View>

            <View style={themedStyles.field}>
              <Text style={themedStyles.labelBold}>Email:</Text>
              <Text style={themedStyles.value}>{user.email}</Text>
            </View>

            <View style={themedStyles.field}>
              <Text style={themedStyles.labelBold}>Type of user:</Text>
              <Text style={themedStyles.value}>{user.type}</Text>
            </View>

            <Button
              mode="contained"
              onPress={handleEditToggle}
              buttonColor={theme.colors.primary}
              style={themedStyles.editButton}
              labelStyle={themedStyles.buttonText}
              contentStyle={themedStyles.buttonContentLarge} 
            >
              Uredi Profil
            </Button>
          </>
        )}
      </Surface>
      
      <View style={themedStyles.bottomActions}>
        <Button
          mode="outlined"
          onPress={handleBack}
          textColor={theme.colors.onBackground}
          style={themedStyles.bottomButton}
          contentStyle={themedStyles.buttonContentLarge}
        >
          Nazad
        </Button>
        <Button
          mode="contained"
          onPress={handleSignout}
          buttonColor={theme.colors.error}
          style={themedStyles.bottomButton}
          contentStyle={themedStyles.buttonContentLarge}
        >
          Odjava
        </Button>
      </View>
    </SafeAreaView>
  );
};


const getThemedStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: "flex-start",
      alignItems: "center",
      padding: 20,
    },
    loadingText: {
      marginTop: 10,
      color: theme.colors.onSurfaceVariant,
    },
    userInfo: {
      backgroundColor: theme.colors.surface,
      padding: 20,
      borderRadius: 12,
      marginBottom: 30,
      width: "100%",
      maxWidth: 400,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.dark ? 0.4 : 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    label: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      marginTop: 10,
      marginBottom: 4,
      fontWeight: "500",
    },
    labelBold: { 
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      marginTop: 0, 
      marginBottom: 4,
      fontWeight: "700", 
    },
    value: {
      fontSize: 18,
      color: theme.colors.onSurface,
      fontWeight: "700", 
    },
    field: {
      marginBottom: 24, 
    },
    editButton: {
      marginTop: 24, 
    },
    buttonRow: {
      flexDirection: "row",
      gap: 16,
      marginTop: 24,
    },
    flexButton: {
      flex: 1,
      borderRadius: 8,
    },
    buttonContent: { 
      paddingVertical: 12, 
    },
    buttonText: {
      color: theme.colors.background,
      fontSize: 16,
      fontWeight: "bold",
    },
    buttonContentLarge: { 
      paddingVertical: 14, 
    },
    bottomActions: {
      width: "100%",
      maxWidth: 400,
      marginTop: 'auto',
      alignItems: 'center',
    },
    bottomButton: {
      width: "70%",
      maxWidth: 300,
      marginBottom: 12,
      borderRadius: 24,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 16,
      textAlign: "center",
    },
    inputGroup: {
      marginBottom: 16,
    },
    input: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 0,
      paddingVertical: 0,
      fontSize: 16,
    },
  });

export default SettingsScreen;