import { Schema, model } from "mongoose";

const BikeSchema = new Schema(
  {
    model: { type: String, required: true },
    color: { type: String, required: true },
    location: { type: String, required: true },
    rate: { type: Number, required: true, min: 0, max: 5, default: 0 },
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

BikeSchema.index({ model: 1, color: 1, location: 1 }, { unique: true });

export default model("Bike", BikeSchema);
