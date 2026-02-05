import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Check, X, FileText, Download } from "lucide-react-native";

type ClaimStatus = "Approved" | "Rejected" | "Pending" | "Submitted";

type Receipt =
  | { type: "image"; url: string }
  | { type: "pdf"; url: string; fileName?: string }
  | null;

interface Props {
  status: ClaimStatus;
  employeeName: string;
  name: string;
  category: string;
  amount: number;
  description?: string;
  date: string;
  receipt?: Receipt;
  comment?: string;

  // admin actions
  onApprove?: () => void;
  onReject?: () => void;

  // optional
  onOpenReceipt?: (url: string) => void;
  actionLoading?: boolean; // disable buttons while approving/rejecting
}

function statusColor(status: ClaimStatus) {
  switch (status) {
    case "Approved":
      return "#16a34a";
    case "Rejected":
      return "#dc2626";
    default:
      return "#ca8a04";
  }
}

function shouldShowBadge(status: ClaimStatus) {
  return status === "Approved" || status === "Rejected";
}

function isActionable(status: ClaimStatus) {
  return status === "Pending" || status === "Submitted";
}

export default function AdminClaimCard({
  status,
  employeeName,
  name,
  category,
  amount,
  description,
  date,
  receipt = null,
  comment,
  onApprove,
  onReject,
  onOpenReceipt,
  actionLoading = false,
}: Props) {
  return (
    <View className="bg-background rounded-xl px-4 pt-4 pb-4 mb-4 shadow-sm border border-gray-200">
      {/* Header */}
      <View className="flex-row items-start justify-between">
        <View className="flex-col flex-1 pr-2">
          {/* ✅ Badge only after decision */}
          {shouldShowBadge(status) ? (
            <View
              style={{
                backgroundColor: statusColor(status),
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 999,
                alignSelf: "flex-start",
                marginTop: 8,
              }}
            >
              <Text className="text-white text-xs font-semibold">{status}</Text>
            </View>
          ) : null}

          <View className={shouldShowBadge(status) ? "mt-2" : "mt-2"}>
            <Text
              className="text-primary text-base font-bold"
              numberOfLines={1}
            >
              {employeeName}
            </Text>

            <Text className="text-gray-700 text-sm mt-1" numberOfLines={1}>
              {name}
            </Text>

            <Text className="text-gray-500 text-xs mt-1">{date}</Text>
          </View>
        </View>

        {/* ✅ Approve / Reject buttons only when Pending/Submitted */}
        {isActionable(status) ? (
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={onApprove}
              disabled={actionLoading}
              style={{
                backgroundColor: actionLoading ? "#bbf7d0" : "#16a34a",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
              }}
              accessibilityLabel="Approve claim"
            >
              {actionLoading ? (
                <ActivityIndicator />
              ) : (
                <View className="flex-row items-center gap-2">
                  <Check size={18} color="#ffffff" />
                  <Text className="text-white font-semibold text-sm">
                    Approve
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onReject}
              disabled={actionLoading}
              style={{
                backgroundColor: actionLoading ? "#fecaca" : "#dc2626",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
              }}
              accessibilityLabel="Reject claim"
            >
              {actionLoading ? (
                <ActivityIndicator />
              ) : (
                <View className="flex-row items-center gap-2">
                  <X size={18} color="#ffffff" />
                  <Text className="text-white font-semibold text-sm">
                    Reject
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      {/* Info */}
      <View className="mt-4 space-y-2">
        <View className="flex-row">
          <Text className="text-black text-sm font-semibold">Category: </Text>
          <Text className="text-secondary text-sm">{category}</Text>
        </View>

        <View className="flex-row">
          <Text className="text-black text-sm font-semibold">Amount: </Text>
          <Text className="text-secondary text-sm">
            LKR {amount.toLocaleString()}
          </Text>
        </View>

        {!!description?.trim() && (
          <View className="mt-1">
            <Text className="text-black text-sm font-semibold mb-1">
              Description:
            </Text>
            <Text className="text-secondary text-sm leading-5">
              {description}
            </Text>
          </View>
        )}
      </View>

      {/* Receipt */}
      <View className="mt-4">
        <Text className="text-black text-sm font-semibold mb-2">Receipt</Text>

        {!receipt ? (
          <Text className="text-gray-400 text-xs mb-4">
            No receipt uploaded
          </Text>
        ) : receipt.type === "image" ? (
          <TouchableOpacity
            onPress={() => onOpenReceipt?.(receipt.url)}
            className="rounded-lg overflow-hidden border border-gray-200 mb-4"
            activeOpacity={0.85}
          >
            <Image
              source={{ uri: receipt.url }}
              className="w-full h-24 rounded-md"
              resizeMode="cover"
            />
            <View className="flex-row items-center justify-between px-3 py-2 bg-gray-50">
              <Text className="text-primary text-xs font-semibold">
                View receipt image
              </Text>
              <Download size={16} color="#111827" />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => onOpenReceipt?.(receipt.url)}
            className="flex-row items-center justify-between px-3 py-2 rounded-lg bg-gray-100 border border-gray-200 mb-4"
            activeOpacity={0.85}
          >
            <View className="flex-row items-center gap-2 flex-1 pr-2">
              <FileText size={18} color="#111827" />
              <Text
                className="text-primary text-sm font-semibold"
                numberOfLines={1}
              >
                {receipt.fileName ?? "Receipt.pdf"}
              </Text>
            </View>
            <Download size={18} color="#111827" />
          </TouchableOpacity>
        )}
        {status === "Rejected" && !!comment?.trim() && (
          <Text className="text-red-600 text-xs font-semibold mt-1">
            Reason: {comment}
          </Text>
        )}
      </View>
    </View>
  );
}
