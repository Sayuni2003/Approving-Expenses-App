const { db, admin } = require("../config/firebaseAdmin");

const claimsCollection = db.collection("claims");
const UserModel = require("../models/userModel");

async function createClaim(data) {
  const docRef = await claimsCollection.add({
    employeeId: data.employeeId,
    name: data.name,
    status: data.status || "Submitted",
    category: data.category,
    amount: data.amount,
    date: data.date,
    description: data.description,
    proof: { url: data.proofUrl || "" },
    viewedAt: null,
    viewedBy: null,
    comment: "",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return docRef.id;
}

async function getClaimsByEmployee(employeeId) {
  const snap = await claimsCollection
    .where("employeeId", "==", employeeId)
    .orderBy("createdAt", "desc")
    .get();

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function updateClaimProofUrl(claimId, proofUrl) {
  await claimsCollection.doc(claimId).update({
    proof: { url: proofUrl },
  });
}

async function updateClaim(claimId, data) {
  // remove undefined fields so they don’t overwrite with null
  const clean = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== undefined),
  );

  await claimsCollection.doc(claimId).update(clean);
}

async function deleteClaim(claimId) {
  await claimsCollection.doc(claimId).delete();
}

async function getClaimById(claimId) {
  const doc = await claimsCollection.doc(claimId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function getAllClaims({ status }) {
  let q = db.collection("claims").orderBy("createdAt", "desc");

  if (status) {
    q = q.where("status", "==", status);
  }

  const snap = await q.get();

  const claims = snap.docs.map((doc) => ({
    claimId: doc.id,
    ...doc.data(),
  }));

  return claims;
}

async function getAllClaimsController(req, res) {
  try {
    const { status } = req.query;

    const claims = await ClaimModel.getAllClaims({ status });

    // collect unique employeeIds
    const userIds = [...new Set(claims.map((c) => c.employeeId))];

    const usersMap = await UserModel.getUsersByIds(userIds);

    // merge name into each claim
    const enrichedClaims = claims.map((claim) => ({
      ...claim,
      employeeName: usersMap[claim.employeeId]?.fullName || "Unknown user",
    }));

    return res.status(200).json({ claims: enrichedClaims });
  } catch (err) {
    console.error("getAllClaimsController error:", err);
    return res.status(500).json({ message: "Failed to fetch claims" });
  }
}

module.exports = {
  createClaim,
  getClaimsByEmployee,
  updateClaimProofUrl,
  updateClaim,
  deleteClaim,
  getClaimById,
  getAllClaims,
  getAllClaimsController,
};
