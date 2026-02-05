import express from "express";
import { createUser, getUserRole } from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUser);
router.get("/:uid/role", getUserRole);

export default router;
