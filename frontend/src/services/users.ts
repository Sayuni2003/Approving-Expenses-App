import { doc, getDoc } from "firebase/firestore";
import { db } from "../../FirebaseConfig";

export type UserRole = "admin" | "employee";

export async function getUserRole(uid: string): Promise<UserRole | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;

  const data = snap.data();
  return (data.role as UserRole) ?? null;
}
