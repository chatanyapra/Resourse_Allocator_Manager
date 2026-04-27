import express from "express";
const router = express.Router();

// AI integration route
router.post("/", async (req, res) => {
  const { query } = req.body;

  // Abhi ke liye dummy response (later tum OpenAI/HuggingFace connect kar sakti ho)
  res.json({ result: `AI response for: ${query}` });
});

export default router;
