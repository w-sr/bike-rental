import { Schema, model } from "mongoose";
import { UserRole } from "../constants/common.constants";
import { validateEmail, validateName } from "../validators/common.validator";

const UserSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 35,
      validate: [validateName, "Please fill a valid first name"],
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
      validate: [validateName, "Please fill a valid last name"],
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 35,
      validate: [validateEmail, "Please fill a valid email address"],
    },
    password: { type: String, required: true, minlength: 8 },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
    deleted: { type: String, default: false },
  },
  {
    timestamps: true,
  }
);

export default model("User", UserSchema);
