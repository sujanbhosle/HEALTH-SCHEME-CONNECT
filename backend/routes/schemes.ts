
import express from "express";
import { MOCK_SCHEMES, MOCK_HOSPITALS } from "../data/db.js";

const router = express.Router();

// GET /api/schemes - Get all schemes
router.get("/", (req, res) => {
  res.json(MOCK_SCHEMES);
});

// GET /api/schemes/:id/hospitals - Get hospitals for a scheme
router.get("/:id/hospitals", (req, res) => {
  const { city } = req.query;
  const scheme = MOCK_SCHEMES.find(s => s.id === req.params.id);
  if (!scheme) return res.json([]);

  let hospitals = MOCK_HOSPITALS.filter(h => h.schemes_accepted?.includes(scheme.code));
  if (city) {
    hospitals = hospitals.filter(h => h.city.toLowerCase() === (city as string).toLowerCase());
  }
  res.json(hospitals);
});

export default router;
