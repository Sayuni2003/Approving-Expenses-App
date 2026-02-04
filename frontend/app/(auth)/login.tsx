import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../FirebaseConfig";
import { router } from "expo-router";

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const credentials = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      console.log("Logged in successfully");
      router.replace("/");
      // Navigate to main app or handle post-login logic here
    } catch (error) {
      console.error("Login error:", error);
      // Handle error, e.g., show alert or set error state
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-3xl font-bold text-primary mb-10">Login</Text>

        {/* Email */}
        <View className="w-full mb-4">
          <Text className="text-sm text-secondary mb-1">Email</Text>
          <TextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white"
          />
        </View>

        {/* Password */}
        <View className="w-full mb-6">
          <Text className="text-sm text-secondary mb-1">Password</Text>
          <TextInput
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white"
          />
        </View>
        {/* Login Button */}
        <TouchableOpacity
          className="w-full bg-primary py-4 rounded-xl items-center"
          onPress={handleLogin}
        >
          <Text className="text-white font-bold text-lg">Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default login;
