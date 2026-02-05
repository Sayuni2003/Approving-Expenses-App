import { doc, getDoc } from "firebase/firestore";
import { db } from "../../FirebaseConfig";
import { getAuth } from "firebase/auth";
const API_URL = "http://10.64.86.152:5000";

export type UserRole = "admin" | "employee";

export async function getUserRole(uid: string): Promise<UserRole | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;

  const data = snap.data();
  return (data.role as UserRole) ?? null;
}

export async function createUserApi(payload: {
  firstName: string;
  lastName: string;
  role: "admin" | "employee";
  email: string;
  password: string;
}) {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken();

  if (!token) {
    throw new Error("Not logged in");
  }

  console.log("Creating user with payload:", payload);
  console.log("API_URL:", API_URL);
  console.log("Token present:", !!token);

  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  console.log("Response status:", res.status);
  console.log("Response text:", text);

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Invalid response from server: ${text}`);
  }

  if (!res.ok) {
    throw new Error(data.message || "Failed to create user");
  }

  return data;
}
