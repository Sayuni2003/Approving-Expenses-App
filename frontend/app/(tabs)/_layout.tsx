import React from "react";
import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  baseTabScreenOptions,
  employeeTabs,
} from "../../src/navigation/tabConfig";

export default function RootLayout() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <Tabs screenOptions={baseTabScreenOptions}>
        {employeeTabs.map(({ name, title, Icon }) => (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              title,
              tabBarIcon: ({ color, size }) => (
                <Icon color={color} size={size} />
              ),
            }}
          />
        ))}
        <Tabs.Screen name="addClaim" options={{ href: null }} />
      </Tabs>
    </SafeAreaView>
  );
}
