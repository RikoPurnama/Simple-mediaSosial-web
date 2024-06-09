import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  maxStudents: {
    type: Number,
    default: 40,
  },
});

const Room = mongoose.model("Room", roomSchema);
export default Room;
