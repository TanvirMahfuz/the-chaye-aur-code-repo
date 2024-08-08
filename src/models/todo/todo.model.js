import mongoose from "mongoose";
const todoSchema = new mongoose.Schema(
  {
    content: {
      Type: String,
      required: true,
    },
    complete: {
      type: true,
      default: false,
    },
    createdby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subTodos: [
      {
        Type: mongoose.Schema.Types.ObjectId,
        ref: "SubToDo",
      },
    ],
  },
  { timestamps: true },
);

export const ToDo = mongoose.model("ToDo", todoSchema);
