const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const calculateRewards = require("../utils/rewardCalculator"); // Import reward logic

const router = express.Router();

// ✅ POST: Add a new transaction
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { amount, category, cardType } = req.body;
    if (!amount || !category || !cardType) {
      return res.status(400).json({ message: "Amount, category, and cardType are required" });
    }

    // Create transaction
    const transaction = new Transaction({
      userId: req.user.id,
      amount,
      category,
      cardType,
    });

    await transaction.save();

    // ✅ Calculate rewards for this transaction
    const rewardPoints = calculateRewards(amount, category, cardType);

    // ✅ Update user's total rewards
    const user = await User.findById(req.user.id);
    user.rewards += rewardPoints;
    await user.save();

    res.json({ message: "Transaction recorded", transaction, rewardPoints });
  } catch (error) {
    console.error("Transaction error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
