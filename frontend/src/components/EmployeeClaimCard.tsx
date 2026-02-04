import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Pencil, Trash2 } from "lucide-react-native";

interface Props {
  name: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  status: "Approved" | "Rejected" | "Pending";
}

const statusColors = {
  Approved: "bg-green-500",
  Rejected: "bg-red-500",
  Pending: "bg-blue",
};

const EmployeeClaimCard = ({
  name,
  category,
  amount,
  description,
  date,
  status,
}: Props) => {
  return (
    <View className="bg-background rounded-xl p-4 mb-4 shadow-sm border border-">
      {/* Status badge */}
      <View
        className={`self-start px-3 py-1 rounded-full ${statusColors[status]}`}
      >
        <Text className="text-white text-xs font-semibold">{status}</Text>
      </View>

      {/* Main content */}
      <View className="mt-3 space-y-1">
        <Text className="text-lg font-bold text-primary">{name}</Text>

        <Text className="text-sm text-gray-600">Category: {category}</Text>

        <Text className="text-sm text-gray-600">Amount: Rs. {amount}</Text>

        <Text className="text-sm text-gray-700">{description}</Text>

        <Text className="text-xs text-gray-400 mt-1">{date}</Text>
      </View>

      {/* Actions */}
      <View className="flex-row justify-end mt-3 space-x-4">
        <TouchableOpacity>
          <Pencil size={20} color="#2563eb" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Trash2 size={20} color="#dc2626" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EmployeeClaimCard;
