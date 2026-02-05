import React from "react";
import { Alert, Text, TouchableOpacity, View, Image } from "react-native";
import { logout } from "../../src/services/auth";
import { signOut } from "firebase/auth";
import { auth } from "../../FirebaseConfig";
import { router } from "expo-router";

const profile = () => {
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          console.log("Logging out...");
          await signOut(auth);
          router.replace("/login");
        },
      },
    ]);
  };
  return (
    <View className="flex-1 justify-center px-6 bg-background">
      <Image
        source={require("../../assets/images/soon.png")}
        className="w-72 h-72 mb-12"
        resizeMode="contain"
      />
      <TouchableOpacity
        onPress={handleLogout}
        className="bg-primary py-4 rounded-xl items-center"
      >
        <Text className="text-white font-bold text-lg">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default profile;
