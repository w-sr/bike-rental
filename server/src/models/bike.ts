import { Schema, model } from "mongoose";

const BikeSchema = new Schema(
  {
    model: { type: String, required: true },
    color: { type: String, required: true },
    location: { type: String, required: true },
    rating: { type: Number, required: true },
    rented: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

export default model("Bike", BikeSchema);
