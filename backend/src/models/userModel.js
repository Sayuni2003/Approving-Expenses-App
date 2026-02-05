const { db, admin } = require("../config/firebaseAdmin");

const usersCollection = db.collection("users");

async function getUsersMapByIds(ids) {
  const unique = [...new Set(ids)].filter(Boolean);
  if (unique.length === 0) return {};

  // Firestore "in" supports max 10 IDs per query
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

module.exports = { getUsersMapByIds };
