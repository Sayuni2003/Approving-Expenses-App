import admin from "../config/firebaseAdmin.js";

export async function getUsersMapByIds(ids) {
  const unique = [...new Set(ids)].filter(Boolean);
  if (unique.length === 0) return {};

  const chunks = [];
  for (let i = 0; i < unique.length; i += 10) {
    chunks.push(unique.slice(i, i + 10));
  }

  const usersMap = {};
  const db = admin.firestore();

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
