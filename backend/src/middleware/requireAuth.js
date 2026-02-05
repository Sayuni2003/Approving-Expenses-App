import { admin } from "../config/firebaseAdmin.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    console.log("AUTH HEADER:", header ? header.slice(0, 25) + "..." : "NONE");

    if (!token) return res.status(401).json({ message: "Missing token" });

    const decoded = await admin.auth().verifyIdToken(token);

    console.log("TOKEN OK. uid:", decoded.uid);

    req.user = decoded;
    next();
  } catch (e) {
    console.log("verifyIdToken FAILED:", e?.code, e?.message);
    return res.status(401).json({ message: "Invalid token" });
  }
}
