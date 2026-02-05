import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { createUser } from "../controllers/userController.js";

const router = Router();

router.post("/", requireAuth, requireAdmin, createUser);

export default router;
