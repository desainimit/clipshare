const mongoose = require("mongoose");

const clipShareSchema = new mongoose.Schema({
  clipData: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
  ipAddress: {
    type: String,
    required: true,
  },
});

const ClipShare = mongoose.model("ClipShare", clipShareSchema);
module.exports = ClipShare;
