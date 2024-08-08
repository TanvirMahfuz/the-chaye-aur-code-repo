import mongoose from "mongoose";
const subtodoSchema = mongoose.Schema(
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
  },
  { timestamps: true },
);
export const SubToDo = mongoose.model("SubToDo", subtodoSchema);
