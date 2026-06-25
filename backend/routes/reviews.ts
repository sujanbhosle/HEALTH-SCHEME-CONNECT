
import express from "express";
import { MOCK_REVIEWS } from "../data/db.js";

const router = express.Router();

// GET /api/reviews/:hospitalId - Get reviews
router.get("/:hospitalId", (req, res) => {
  const reviews = MOCK_REVIEWS.filter(r => r.hospital_id === req.params.hospitalId);
  res.json(reviews);
});

// POST /api/reviews - Add a review
router.post("/", (req, res) => {
  const { hospital_id, user_id, rating, title, body } = req.body;
  const newReview = {
    id: `r${Math.random()}`,
    hospital_id,
    user_id,
    rating,
    title,
    body,
    verified: false,
    created_at: new Date().toISOString()
  };
  MOCK_REVIEWS.push(newReview);
  res.status(201).json(newReview);
});

export default router;
