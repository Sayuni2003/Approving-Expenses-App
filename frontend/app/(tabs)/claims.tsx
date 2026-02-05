import React, { useEffect, useState, useCallback } from "react";
import { Text, View, TouchableOpacity, ScrollView, Alert } from "react-native";
import EmployeeClaimCard from "@/src/components/EmployeeClaimCard";
import { router } from "expo-router";
import { apiGet, apiDelete } from "@/src/services/api";
import { auth } from "@/FirebaseConfig";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useFocusEffect } from "expo-router";

type Claim = {
  id: string;
  name: string;
  status: "Approved" | "Rejected" | "Submitted";
  category: string;
  amount: number;
  date: string;
  description: string;
  proof?: { url?: string };
  comment?: string;
};

function receiptFromUrl(url?: string) {
  if (!url) return null;
  const lower = url.toLowerCase();
  if (lower.endsWith(".pdf"))
    return { type: "pdf" as const, url, fileName: "Receipt.pdf" };
  return { type: "image" as const, url };
}

const Claims = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadClaims() {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Not logged in", "Please login again.");
        return;
      }

      const data = await apiGet(`/claims/my/${user.uid}`);
      setClaims(data);
    } catch (e: any) {
      console.log("load claims error:", e);
      Alert.alert("Error", e?.message ?? "Failed to load claims");
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadClaims();
    }, []),
  );

  return (
    <ScrollView className="bg-white p-4">
      <View className="flex-1 p-4 bg-white">
        <View className="flex-row justify-end mb-4">
          <TouchableOpacity
            className="bg-primary px-4 py-2 rounded-lg"
            onPress={() => router.push("/(tabs)/addClaim")}
          >
            <Text className="text-white font-semibold">+ Add New Claim</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-4xl font-bold text-primary mb-3">Claims</Text>

        {loading ? (
          <Text>Loading...</Text>
        ) : claims.length === 0 ? (
          <Text className="text-gray-500">No claims yet.</Text>
        ) : (
          claims.map((c) => (
            <EmployeeClaimCard
              key={c.id}
              status={c.status}
              name={c.name || "Claim"}
              category={c.category}
              amount={c.amount}
              description={c.description}
              date={c.date}
              receipt={receiptFromUrl(c.proof?.url)}
              comment={c.comment}
              onOpenReceipt={(url) => WebBrowser.openBrowserAsync(url)}
              onEdit={() => router.push(`/(tabs)/addClaim?claimId=${c.id}`)}
              onDelete={() => {
                if (c.status !== "Submitted") {
                  Alert.alert(
                    "Not allowed",
                    "Only Submitted claims can be deleted.",
                  );
                  return;
                }

                Alert.alert("Delete claim?", "This cannot be undone.", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                      try {
                        await apiDelete(`/claims/${c.id}`);
                        await loadClaims();
                      } catch (e: any) {
                        Alert.alert("Error", e?.message ?? "Delete failed");
                      }
                    },
                  },
                ]);
              }}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default Claims;
