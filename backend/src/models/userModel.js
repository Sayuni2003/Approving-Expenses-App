import { db, admin } from "../config/firebaseAdmin.js";

const usersCollection = db.collection("users");

async function createUserDoc(uid, data) {
  const userDoc = {
    firstName: data.firstName,
    lastName: data.lastName,
    fullName: `${data.firstName} ${data.lastName}`.trim(),
    email: data.email,
    role: data.role, // "admin" or "employee"
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await usersCollection.doc(uid).set(userDoc);
  return userDoc;
}

// keep your existing function
async function getUsersMapByIds(ids) {
  const unique = [...new Set(ids)].filter(Boolean);
  if (unique.length === 0) return {};

  const chunks = [];
  for (let i = 0; i < unique.length; i += 10) {
    chunks.push(unique.slice(i, i + 10));
  }

  const usersMap = {};
  for (const batch of chunks) {
    const snap = await db
      .collection("users")
      .where(admin.firestore.FieldPath.documentId(), "in", batch)
      .get();

    snap.forEach((doc) => {
      usersMap[doc.id] = doc.data();
    });
  }

  return usersMap;
}

export { getUsersMapByIds, createUserDoc };
