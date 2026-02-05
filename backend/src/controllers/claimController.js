import * as ClaimModel from "../models/claimModel.js";
import * as UserModel from "../models/userModel.js";
import { admin } from "../config/firebaseAdmin.js";

export async function addClaim(req, res) {
  try {
    const { employeeId, name, category, amount, date, description, proofUrl } =
      req.body;

    // Basic validation
    if (!employeeId || !category || amount == null || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const claimId = await ClaimModel.createClaim({
      employeeId,
      name,
      category,
      amount,
      date,
      description: description || "",
      proofUrl: proofUrl || "",
    });

    res.status(201).json({ message: "Claim created", claimId });
  } catch (err) {
    console.log("addClaim error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function getMyClaims(req, res) {
  try {
    const { employeeId } = req.params;
    const claims = await ClaimModel.getClaimsByEmployee(employeeId);
    res.json(claims);
  } catch (err) {
    console.log("getMyClaims error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export async function updateProof(req, res) {
  try {
    const { claimId } = req.params;
    const { proofUrl } = req.body;

    if (!proofUrl) {
      return res.status(400).json({ message: "proofUrl is required" });
    }

    await ClaimModel.updateClaimProofUrl(claimId, proofUrl);

    return res.json({ message: "Proof updated" });
  } catch (err) {
    console.log("updateProof error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function updateClaim(req, res) {
  try {
    const { claimId } = req.params;
    const { name, category, amount, date, description } = req.body;

    await ClaimModel.updateClaim(claimId, {
      name,
      category,
      amount,
      date,
      description,
    });

    return res.json({ message: "Claim updated" });
  } catch (err) {
    console.log("updateClaim error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function deleteClaim(req, res) {
  try {
    const { claimId } = req.params;

    await ClaimModel.deleteClaim(claimId);

    return res.json({ message: "Claim deleted" });
  } catch (err) {
    console.log("deleteClaim error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getClaimById(req, res) {
  try {
    const { claimId } = req.params;
    const claim = await ClaimModel.getClaimById(claimId);

    if (!claim) return res.status(404).json({ message: "Claim not found" });

    return res.json(claim);
  } catch (err) {
    console.log("getClaimById error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getAllClaimsController(req, res) {
  try {
    const { status } = req.query;

    const claims = await ClaimModel.getAllClaims({ status });

    const employeeIds = claims.map((c) => c.employeeId);
    const usersMap = await UserModel.getUsersMapByIds(employeeIds);

    const enriched = claims.map((c) => {
      const user = usersMap[c.employeeId];

      const employeeName = user
        ? `${user.firstName} ${user.lastName}`
        : "Unknown Employee";

      return {
        ...c,
        employeeName,
      };
    });

    return res.status(200).json({ claims: enriched });
  } catch (err) {
    console.error("getAllClaimsController error:", err);
    return res.status(500).json({
      message: "Failed to fetch claims",
      error: err?.message || String(err),
    });
  }
}

export async function decideClaim(req, res) {
  try {
    const { claimId } = req.params;
    const { status, comment, adminId } = req.body;

    if (!adminId)
      return res.status(400).json({ message: "adminId is required" });
    if (!status || !["Approved", "Rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: "status must be Approved or Rejected" });
    }

    //  Reject requires comment (1–50 chars)
    const cleanComment = (comment ?? "").trim();
    if (status === "Rejected") {
      if (cleanComment.length < 1) {
        return res
          .status(400)
          .json({ message: "comment is required for rejection" });
      }
      if (cleanComment.length > 50) {
        return res
          .status(400)
          .json({ message: "comment must be 50 characters or less" });
      }
    }

    await ClaimModel.updateClaim(claimId, {
      status,
      comment: status === "Rejected" ? cleanComment : "",

      // store for history
      viewedAt: admin.firestore.FieldValue.serverTimestamp(),
      viewedBy: adminId,
    });

    return res.json({ message: "Decision saved" });
  } catch (err) {
    console.log("decideClaim error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
