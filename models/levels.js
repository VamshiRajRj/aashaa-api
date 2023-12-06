const mongoose = require("mongoose");

const UserScoreSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  levelId: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("UserScore", UserScoreSchema);
