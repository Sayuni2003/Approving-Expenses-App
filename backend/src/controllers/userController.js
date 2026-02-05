// src/controllers/userController.js
import { admin } from "../config/firebaseAdmin.js";

export async function createUser(req, res) {
  try {
    const { firstName, lastName, role, email, password } = req.body;

    console.log("createUser called with:", {
      firstName,
      lastName,
      role,
      email,
    });
    console.log("Authenticated user uid:", req.user?.uid);

    // Basic validation
    if (!firstName || !lastName)
      return res.status(400).json({ message: "Name required" });
    if (!email) return res.status(400).json({ message: "Email required" });
    if (!password || password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 chars" });
    if (!["admin", "employee"].includes(role))
      return res.status(400).json({ message: "Invalid role" });

    // 1) Create Firebase Auth user
    console.log("Creating Firebase Auth user...");
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    const uid = userRecord.uid;
    console.log("Firebase user created with uid:", uid);

    // 2) Create Firestore profile doc
    console.log("Creating Firestore profile...");
    await admin.firestore().collection("users").doc(uid).set({
      email,
      firstName,
      lastName,
      role,
      disabled: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: req.user.uid,
    });

    console.log("User successfully created:", uid);

    return res.status(201).json({
      uid,
      email,
      firstName,
      lastName,
      role,
    });
  } catch (e) {
    console.log("Error creating user:", e.code, e.message);
    // Common: auth/email-already-exists
    return res.status(400).json({ message: e.message });
  }
}
