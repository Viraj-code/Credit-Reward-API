const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  rewards: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", UserSchema);
