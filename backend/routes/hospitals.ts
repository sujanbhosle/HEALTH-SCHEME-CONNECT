
import express from "express";
import { MOCK_HOSPITALS, MOCK_BED_STATUS, MOCK_HOSPITAL_TREATMENTS, MOCK_TREATMENTS } from "../data/db.js";

const router = express.Router();

// GET /api/hospitals - Search hospitals
router.get("/", (req, res) => {
  const { city, schemeCode } = req.query;
  let results = MOCK_HOSPITALS;

  if (city) {
    results = results.filter(h => h.city.toLowerCase() === (city as string).toLowerCase());
  }

  if (schemeCode) {
    results = results.filter(h => 
      h.schemes_accepted?.some(sCode => sCode.toLowerCase() === (schemeCode as string).toLowerCase())
    );
  }

  res.json(results);
});

// GET /api/hospitals/:id - Get hospital details
router.get("/:id", (req, res) => {
  const hospital = MOCK_HOSPITALS.find(h => h.id === req.params.id);
  if (!hospital) return res.status(404).json({ message: "Hospital not found" });
  res.json(hospital);
});

// GET /api/hospitals/:id/beds - Get bed status
router.get("/:id/beds", (req, res) => {
  const status = MOCK_BED_STATUS.find(bs => bs.hospital_id === req.params.id);
  res.json(status || null);
});

// GET /api/hospitals/:id/treatments - Get treatments
router.get("/:id/treatments", (req, res) => {
    const hospitalTreatments = MOCK_HOSPITAL_TREATMENTS.filter(ht => ht.hospital_id === req.params.id);
    const detailedTreatments = hospitalTreatments.map(ht => {
        const treatment = MOCK_TREATMENTS.find(t => t.id === ht.treatment_id);
        return treatment ? { treatment, details: ht } : null;
    }).filter(Boolean);
    res.json(detailedTreatments);
});

export default router;
