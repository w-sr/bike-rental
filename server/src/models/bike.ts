import { Schema, model } from "mongoose";

const BikeSchema = new Schema(
  {
    model: { type: String, required: true },
    color: { type: String, required: true },
    location: { type: String, required: true },
    rate: { type: String, required: true },
    reserved_user_id: { type: String },
    reserved: { type: Boolean, required: true },
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default model("Bike", BikeSchema);
