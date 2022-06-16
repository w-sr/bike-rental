import mongoose from "mongoose";
import { Bike, Reservation } from "../models";
import { Context } from "../models/context";

export class BikeController {
  // @VerifyAuthorization
  async getReservation(args: any, ctx: Context) {
    return await Reservation.find({ id: args["id"] }).then(
      (reservations: any) => reservations[0]
    );
  }

  // @VerifyAuthorization
  async getReservations(args: any, ctx: Context) {
    const { input: { user = "", bike = "" } = {} } = args;
    const query: any = {};
    if (user) {
      query.user = user;
    }
    if (bike) {
      query.bike = bike;
    }
    return await Reservation.find(query)
      .populate({
        path: "bike",
        model: "Bike",
      })
      .populate({
        path: "user",
        model: "User",
      })
      .then((reservations: any) => reservations);
  }

  // @VerifyAuthorization
  async addReservation(args: any, ctx: any) {
    await Bike.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(args.input.bike) },
      { reserved: true, reserved_user_id: args.input.user }
    );
    return await Reservation.create(args.input).then(
      (reservation: any) => reservation
    );
  }

  async cancelReservation(args: any, ctx: any) {
    await Bike.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(args.id) },
      { reserved: false, reserved_user_id: null }
    );
    return { success: true };
  }
}

export default BikeController;
