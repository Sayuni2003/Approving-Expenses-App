import { admin } from "../config/firebaseAdmin.js";

export async function requireAdmin(req, res, next) {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ message: "Not authenticated" });

    const snap = await admin.firestore().collection("users").doc(uid).get();
    if (!snap.exists) return res.status(403).json({ message: "No profile" });

    const data = snap.data();
    if (data.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    next();
  } catch {
    return res.status(500).json({ message: "Admin check failed" });
  }
}
