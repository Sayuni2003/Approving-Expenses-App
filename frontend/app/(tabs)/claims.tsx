import React from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import EmployeeClaimCard from "@/src/components/EmployeeClaimCard";
import { router } from "expo-router";

const Claims = () => {
  return (
    <ScrollView className="bg-white p-4">
      <View className="flex-1 p-4 bg-white">
        {/* Top right button */}
        <View className="flex-row justify-end mb-4">
          <TouchableOpacity className="bg-primary px-4 py-2 rounded-lg">
            <Text
              className="text-white font-semibold"
              onPress={() => router.push("/(tabs)/addClaim")}
            >
              + Add New Claim
            </Text>
          </TouchableOpacity>
        </View>

        {/* Heading below */}
        <Text className="text-4xl font-bold text-primary mb-3">Claims</Text>

        {/* Page content */}
        <EmployeeClaimCard
          name="Internet Bill"
          category="Internet"
          amount={3500}
          description="Monthly WiFi payment"
          date="2026-02-01"
          status="Pending"
        />
      </View>
    </ScrollView>
  );
};

export default Claims;
