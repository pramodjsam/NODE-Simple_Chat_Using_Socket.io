const mongoose = require("mongoose");

const mongooseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const chatModel = mongoose.model("Chat", mongooseSchema);

module.exports = chatModel;
