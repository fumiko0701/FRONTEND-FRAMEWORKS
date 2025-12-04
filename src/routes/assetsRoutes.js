// src/routes/assetsRoutes.js
import express from "express";

const router = express.Router();

// opcional (caso queira adicionar upload futuramente)
router.get("/", (req, res) => {
  res.json({ message: "Pasta de assets disponível" });
});

export default router;
