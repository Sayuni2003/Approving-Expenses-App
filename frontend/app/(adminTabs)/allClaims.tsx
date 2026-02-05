import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Linking,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "expo-router";
import AdminClaimCard from "../../src/components/AdminClaimCard";
import { apiGet, apiPatch } from "../../src/services/api";
import { auth } from "@/FirebaseConfig";

type Receipt =
  | { type: "image"; url: string }
  | { type: "pdf"; url: string; fileName?: string }
  | null;

function toReceipt(proofUrl?: string, fileName?: string): Receipt {
  if (!proofUrl) return null;
  const lower = proofUrl.toLowerCase();
  if (lower.endsWith(".pdf")) return { type: "pdf", url: proofUrl, fileName };
  return { type: "image", url: proofUrl };
}

export default function AdminClaimsScreen() {
  const [claims, setClaims] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ reject modal state
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectText, setRejectText] = useState("");
  const [rejectClaimId, setRejectClaimId] = useState<string | null>(null);

  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function loadClaims() {
    const data = await apiGet("/claims");
    setClaims(data?.claims ?? []);
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadClaims();
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadClaims();
    }, []),
  );

  async function approveClaim(claimId: string) {
    try {
      const user = auth.currentUser;
      if (!user) return Alert.alert("Not logged in", "Login again");

      setLoadingId(claimId);
      await apiPatch(`/claims/${claimId}/decision`, {
        status: "Approved",
        comment: "",
        adminId: user.uid,
      });
      await loadClaims();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Approve failed");
    } finally {
      setLoadingId(null);
    }
  }

  function openRejectModal(claimId: string) {
    setRejectClaimId(claimId);
    setRejectText("");
    setRejectOpen(true);
  }

  async function submitReject() {
    try {
      const user = auth.currentUser;
      if (!user) return Alert.alert("Not logged in", "Login again");

      const text = rejectText.trim();
      if (text.length < 1)
        return Alert.alert("Missing reason", "Enter a reason");
      if (text.length > 50) return Alert.alert("Too long", "Max 50 characters");

      if (!rejectClaimId) return;

      setLoadingId(rejectClaimId);
      await apiPatch(`/claims/${rejectClaimId}/decision`, {
        status: "Rejected",
        comment: text,
        adminId: user.uid,
      });

      setRejectOpen(false);
      setRejectClaimId(null);
      await loadClaims();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Reject failed");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <View className="flex-1 bg-background px-4 pt-4">
      <Text className="text-xl font-bold mb-4">All Claims</Text>

      <FlatList
        data={claims}
        keyExtractor={(item) => item.claimId}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <AdminClaimCard
            status={item.status}
            employeeName={item.employeeName}
            name={item.name}
            category={item.category}
            amount={item.amount}
            description={item.description}
            date={item.date}
            receipt={toReceipt(
              item.proof?.url || item.proofUrl,
              item.proof?.fileName,
            )}
            comment={item.comment} // ✅ pass comment
            onOpenReceipt={(url) => Linking.openURL(url)}
            onApprove={() => approveClaim(item.claimId)}
            onReject={() => openRejectModal(item.claimId)}
            actionLoading={loadingId === item.claimId}
          />
        )}
        ListEmptyComponent={
          <View className="items-center mt-10">
            <Text className="text-gray-400">No claims found</Text>
          </View>
        }
      />

      {/* ✅ Reject popup */}
      <Modal visible={rejectOpen} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View className="bg-white rounded-xl p-4">
            <Text className="text-lg font-bold text-primary mb-2">
              Reject claim
            </Text>
            <Text className="text-gray-600 mb-3">
              Enter reason (max 50 characters)
            </Text>

            <TextInput
              value={rejectText}
              onChangeText={(t) => setRejectText(t.slice(0, 50))}
              maxLength={50}
              placeholder="Reason..."
              className="border border-gray-200 rounded-lg px-3 py-3 bg-white"
            />

            <Text className="text-gray-400 text-xs mt-2">
              {rejectText.length}/50
            </Text>

            <View className="flex-row gap-3 mt-4">
              <TouchableOpacity
                className="flex-1 bg-gray-200 rounded-lg py-3 items-center"
                onPress={() => setRejectOpen(false)}
              >
                <Text className="text-primary font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-red-600 rounded-lg py-3 items-center"
                onPress={submitReject}
              >
                <Text className="text-white font-semibold">Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
