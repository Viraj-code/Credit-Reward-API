const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  totalPoints: { type: Number, default: 0 }, // Total reward points
  transactions: [
    {
      transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
      points: { type: Number, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Reward = mongoose.model("Reward", rewardSchema);
module.exports = Reward;
