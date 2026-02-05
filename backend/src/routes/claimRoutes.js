import express from "express";
import * as ClaimController from "../controllers/claimController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

//create
router.post("/", requireAuth, ClaimController.addClaim);

//get all claims-admin
router.get("/", requireAuth, ClaimController.getAllClaimsController);

//get all claims-employee
router.get("/my/:employeeId", requireAuth, ClaimController.getMyClaims);

//updates
router.patch("/:claimId/proof", requireAuth, ClaimController.updateProof);
router.patch("/:claimId/decision", requireAuth, ClaimController.decideClaim);
router.patch("/:claimId", requireAuth, ClaimController.updateClaim);

//get one claim
router.get("/:claimId", requireAuth, ClaimController.getClaimById);

//delete claim
router.delete("/:claimId", requireAuth, ClaimController.deleteClaim);

export default router;
