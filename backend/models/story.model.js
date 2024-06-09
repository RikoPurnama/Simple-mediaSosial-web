import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
  },
  mediaUrl: {
    type: String,
  },
  mediaType: {
    type: String,
    enum: ["image", "video"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "24h",
  },
});

const Story = mongoose.model("Story", storySchema);

export default Story;
