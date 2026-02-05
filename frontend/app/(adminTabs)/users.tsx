import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";

import { createUserApi } from "@/src/services/users";

type Role = "Employee" | "Admin";

type UserRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
};

const Users = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<Role>("Employee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [rows, setRows] = useState<UserRow[]>([]);

  const backendRole = role === "Admin" ? "admin" : "employee";

  const fullName = useMemo(
    () => `${firstName.trim()} ${lastName.trim()}`.trim(),
    [firstName, lastName],
  );

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setRole("Employee");
    setEmail("");
    setPassword("");
  };

  const closeModal = () => {
    if (loading) return;
    setOpen(false);
    resetForm();
  };

  const validate = () => {
    if (!firstName.trim()) return "First name is required.";
    if (!lastName.trim()) return "Last name is required.";
    if (!email.trim()) return "Email is required.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return "Enter a valid email.";
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  const onSubmit = async () => {
    const err = validate();
    if (err) {
      Alert.alert("Invalid details", err);
      return;
    }

    try {
      setLoading(true);

      const created = await createUserApi({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role: backendRole,
        email: email.trim().toLowerCase(),
        password,
      });

      const newRow: UserRow = {
        id: created.uid,
        firstName: created.firstName,
        lastName: created.lastName,
        email: created.email,
        createdAt: new Date(),
      };

      setRows((prev) => [newRow, ...prev]);

      Alert.alert("Success", `User created: ${fullName}`);
      closeModal();
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <View className="flex-1 bg-background px-4 pt-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-xl font-bold text-secondary">Users</Text>

        <TouchableOpacity
          onPress={() => setOpen(true)}
          className="bg-primary px-4 py-2 rounded-xl"
          activeOpacity={0.85}
        >
          <Text className="text-white font-semibold">+ Add New User</Text>
        </TouchableOpacity>
      </View>

      <View className="border border-gray-200 rounded-xl overflow-hidden">
        <View className="flex-row bg-gray-100 px-3 py-3">
          <Text className="flex-1 font-semibold text-secondary">Name</Text>
          <Text className="flex-1 font-semibold text-secondary">Email</Text>
          <Text className="w-28 text-right font-semibold text-secondary">
            Created At
          </Text>
        </View>

        <ScrollView className="max-h-[75%]">
          {rows.length === 0 ? (
            <View className="px-3 py-5">
              <Text className="text-secondary/70">No users yet.</Text>
            </View>
          ) : (
            rows.map((u) => (
              <View
                key={u.id}
                className="flex-row items-center px-3 py-3 border-t border-gray-200 bg-white"
              >
                <Text className="flex-1 text-secondary">
                  {u.firstName} {u.lastName}
                </Text>
                <Text className="flex-1 text-secondary">{u.email}</Text>
                <Text className="w-28 text-right text-secondary">
                  {formatDate(u.createdAt)}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      <Modal visible={open} transparent animationType="fade">
        <Pressable className="flex-1 bg-black/40" onPress={closeModal} />

        <View className="absolute left-0 right-0 top-24 px-4">
          <View className="bg-background rounded-2xl p-4 border border-gray-200 shadow-sm">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-secondary">
                Add New User
              </Text>
              <TouchableOpacity onPress={closeModal} className="px-2 py-1">
                <Text className="text-secondary font-semibold">✕</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-secondary mb-1">First Name</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              className="border border-gray-200 rounded-xl px-3 py-2 mb-3 text-secondary"
            />

            <Text className="text-secondary mb-1">Last Name</Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              className="border border-gray-200 rounded-xl px-3 py-2 mb-3 text-secondary"
            />

            <Text className="text-secondary mb-1">Role</Text>
            <View className="flex-row gap-2 mb-3">
              {(["Employee", "Admin"] as Role[]).map((r) => (
                <TouchableOpacity
                  key={r}
                  onPress={() => setRole(r)}
                  className={`flex-1 rounded-xl px-3 py-2 border ${
                    role === r
                      ? "bg-primary border-primary"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <Text
                    className={`text-center font-semibold ${
                      role === r ? "text-white" : "text-secondary"
                    }`}
                  >
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-secondary mb-1">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              className="border border-gray-200 rounded-xl px-3 py-2 mb-3 text-secondary"
            />

            <Text className="text-secondary mb-1">Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="border border-gray-200 rounded-xl px-3 py-2 mb-4 text-secondary"
            />

            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={closeModal}
                className="flex-1 border border-gray-200 rounded-xl py-3"
              >
                <Text className="text-center font-semibold text-secondary">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onSubmit}
                disabled={loading}
                className={`flex-1 rounded-xl py-3 ${
                  loading ? "bg-gray-400" : "bg-primary"
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-center font-semibold text-white">
                    Create User
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Users;
