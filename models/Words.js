const mongoose = require("mongoose");

const Words = mongoose.Schema({
  level: {
    type: Number,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  words: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("words", Words);
