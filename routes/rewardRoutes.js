const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const Reward = require("../models/Reward");
const calculateRewards = require("../utils/rewardCalculator"); // Import reward logic

const router = express.Router();

// ✅ POST: Recalculate rewards based on transactions
router.post("/calculate", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const transactions = await Transaction.find({ userId: req.user.id });

    let totalRewards = 0;
    transactions.forEach((txn) => {
      totalRewards += calculateRewards(txn.amount, txn.category, txn.cardType); // New logic
    });

    user.rewards = totalRewards;
    await user.save();

    res.json({ message: "Rewards updated", totalRewards });
  } catch (error) {
    console.error("Rewards error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET: Fetch total rewards
router.get("/calculate", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ totalRewards: user.rewards });
  } catch (error) {
    console.error("Error fetching rewards:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
