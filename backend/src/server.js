import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import claimRoutes from "./routes/claimRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.use("/claims", claimRoutes);
console.log("userRoutes type:", typeof userRoutes);
console.log("userRoutes keys:", userRoutes && Object.keys(userRoutes));

app.use("/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
