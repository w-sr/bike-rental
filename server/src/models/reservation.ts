import { model, Schema } from "mongoose";
import { ReserveStatus } from "../constants/common.constants";
import { validateDate } from "../validators/common.validator";

const ReservationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bike: { type: Schema.Types.ObjectId, ref: "Bike", required: true },
    start_date: {
      type: String,
      required: true,
      validate: [
        validateDate,
        "Please fill a start date with yyyy-mm-dd format",
      ],
    },
    end_date: {
      type: String,
      required: true,
      validate: [
        validateDate,
        "Please fill a start date with yyyy-mm-dd format",
      ],
    },
    rate: { type: Number, required: true, min: 0, max: 5, default: 0 },
    status: {
      type: String,
      required: true,
      enum: Object.values(ReserveStatus),
    },
  },
  {
    timestamps: true,
  }
);

export default model("Reservation", ReservationSchema);
