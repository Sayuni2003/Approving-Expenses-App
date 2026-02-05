import { admin, db } from "../config/firebaseAdmin.js";
import { createUserDoc } from "../models/userModel.js";

export async function createUser(req, res) {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!["admin", "employee"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // 1) Create Firebase Auth user
    const userRecord = await admin.auth().createUser({
      email: email.trim().toLowerCase(),
      password,
      displayName: `${firstName.trim()} ${lastName.trim()}`.trim(),
    });

    const uid = userRecord.uid;

    // 2) Create Firestore user document
    const userDoc = await createUserDoc(uid, {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      role,
    });

    return res.status(201).json({ uid, ...userDoc });
  } catch (err) {
    console.log("createUser error:", err);

    if (err?.code === "auth/email-already-exists") {
      return res.status(409).json({ message: "Email already exists" });
    }

    return res.status(500).json({ message: err?.message ?? "Server error" });
  }
}

export async function getUserRole(req, res) {
  try {
    const { uid } = req.params;

    const doc = await db.collection("users").doc(uid).get();
    if (!doc.exists) return res.status(404).json({ message: "User not found" });

    const data = doc.data();
    return res.json({ role: data.role });
  } catch (err) {
    console.log("getUserRole error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
