import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Pencil, Trash2, FileText, Download } from "lucide-react-native";

type ClaimStatus = "Approved" | "Rejected" | "Pending" | "Submitted";

type Receipt =
  | { type: "image"; url: string }
  | { type: "pdf"; url: string; fileName?: string }
  | null;

interface Props {
  status: ClaimStatus;
  name: string;
  category: string;
  amount: number;
  description?: string;
  date: string; // "YYYY-MM-DD" or any display string
  receipt?: Receipt;
  comment?: string;

  onEdit?: () => void;
  onDelete?: () => void;
  onOpenReceipt?: (url: string) => void; // you can open with Linking.openURL
}

function statusColor(status: ClaimStatus) {
  switch (status) {
    case "Approved":
      return "#16a34a"; // green-600
    case "Rejected":
      return "#dc2626"; // red-600
    case "Pending":
    case "Submitted":
    default:
      return "#e6a519"; // yellow-600
  }
}

export default function EmployeeClaimCard({
  status,
  name,
  category,
  amount,
  description,
  date,
  receipt = null,
  comment,
  onEdit,
  onDelete,
  onOpenReceipt,
}: Props) {
  return (
    <View className="bg-background rounded-xl px-4 pt-4 pb-4 mb-4 shadow-sm border border-gray-200 relative">
      {/* Title + actions */}
      <View className="flex-row items-center justify-between">
        <View className="flex-col flex-1 pr-2">
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
            <Text className="text-white text-xs font-semibold pt-6">
              {status}
            </Text>
          </View>
          <View className="mt-2 flex-1">
            <Text
              className="text-primary text-base font-bold"
              numberOfLines={1}
            >
              {name}
            </Text>
            <Text className="text-gray-500 text-xs mt-1">{date}</Text>
          </View>
        </View>

        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={onEdit}
            className="p-2 rounded-lg bg-gray-100"
            accessibilityLabel="Edit claim"
          >
            <Pencil size={18} color="#111827" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onDelete}
            className="p-2 rounded-lg bg-gray-100"
            accessibilityLabel="Delete claim"
          >
            <Trash2 size={18} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Info rows */}
      <View className="mt-4 space-y-2">
        <View className="flex-row ">
          <Text className="text-black text-sm font-semibold">Category: </Text>
          <Text className="text-secondary text-sm ">{category}</Text>
        </View>

        <View className="flex-row">
          <Text className="text-black text-sm font-semibold">Amount: </Text>
          <Text className="text-secondary text-sm ">
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
          <Text className="text-gray-400 text-xs mb-4 ">
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
      </View>
      {status === "Rejected" && !!comment?.trim() && (
        <Text className="text-red-600 text-xs font-semibold mt-1">
          Reason: {comment}
        </Text>
      )}
    </View>
  );
}
