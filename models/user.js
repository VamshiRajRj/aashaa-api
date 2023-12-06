const mongoose = require("mongoose");

const Users = mongoose.Schema({
  currentLevel: {
    type: Object,
    required: true,
  },
  scores: {
    type: Object,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("users", Users);
