import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    deleted: { type: String, default: false },
  },
  {
    timestamps: true,
  }
);

export default model("User", UserSchema);
