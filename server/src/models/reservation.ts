import { Schema, model } from "mongoose";

const ReservationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    bike: { type: Schema.Types.ObjectId, ref: "Bike" },
    start_date: { type: String, required: true },
    end_date: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default model("Reservation", ReservationSchema);
