const mongoose = require("mongoose");

const Tasks = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please enter the title"],
    },
    description: {
      type: String,
      required: [true, "Please enter the title"],
    },
    status: {
      type: String,
      enum: ["completed", "pending"],
      default: "pending",
    },
    dueDate: {
      type: Date,
      required: [true, "Please enter the dueDate"],
    },
    priority: {
      type: String,
      required: [true, "Please enter the priority"],
      enum: ["low", "medium", "high"],
    },
    isDeleted: {
      type: Boolean,
      enum: ["false", "true"],
      default: "false",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tasks", Tasks);
