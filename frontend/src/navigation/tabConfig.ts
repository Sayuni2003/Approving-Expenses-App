import {
  ReceiptText,
  User,
  Users,
  ClipboardList,
  LayoutDashboard,
} from "lucide-react-native";

export const baseTabScreenOptions = {
  headerShown: false,
  tabBarShowLabel: true,
  tabBarActiveTintColor: "#E07136",
};

type TabIcon = typeof ReceiptText;

export type TabItem = {
  name: string; // route file name, e.g. "claims"
  title: string; // label shown in tab bar
  Icon: TabIcon; // lucide icon component
};

export const employeeTabs: TabItem[] = [
  { name: "claims", title: "Claims", Icon: ReceiptText },
  { name: "profile", title: "Profile", Icon: User },
];

export const adminTabs: TabItem[] = [
  { name: "allClaims", title: "All Claims", Icon: ClipboardList },
  { name: "users", title: "Users", Icon: Users },
  { name: "profile", title: "Profile", Icon: User },
];
