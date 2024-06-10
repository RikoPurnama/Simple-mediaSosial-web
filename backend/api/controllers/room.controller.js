import User from "../models/user.model.js";
import Room from "../models/room.model.js";

export const createRooms = async (req, res) => {
  const { name, description } = req.body;
  try {
    const room = new Room({ name, description });
    room.save();
    res.status(200).json(room);
  } catch (error) {
    console.log("error in createRooms controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const joinRooms = async (req, res) => {
  const { roomId } = req.body;
  const userId = req.body.userId;

  try {
    const rooms = await Room.findById(roomId);

    if (!rooms) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (rooms.students.length >= rooms.maxStudents.length) {
      return res.status(400).json({ error: "Room is full" });
    }

    if (rooms.students.includes(userId)) {
      return res
        .status(400)
        .json({ error: "User is already enrolled in a classroom" });
    }

    rooms.students.push(userId);
    await rooms.save();

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.classroom) {
        user.classroom = [];
      }


    user.classroom.push(roomId);
    await user.save();


    res.status(200).json(rooms);
  } catch (error) {
    console.log("error in joinRooms controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
