import { ApolloError } from "apollo-server-errors";
import { ErrorConstants } from "../constants/errors.constants";
import { VerifyAuthorization } from "../decorators/auth.decorator";
import { Reservation } from "../models";
import { Context } from "../models/context";

export class BikeController {
  // @VerifyAuthorization
  async getReservation(args: any, ctx: Context) {
    return await Reservation.find({ id: args["id"] }).then(
      (reservations: any) => reservations[0]
    );
  }

  // @VerifyAuthorization
  async getReservations(args: any, ctx: any) {
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
     .lean()
  }

  // @VerifyAuthorization
  async addReservation(args: any, ctx: any) {
    if (ctx.user.role === "manager") {
      throw new ApolloError(ErrorConstants.PERMISSION_DENIED);
    }
    return await Reservation.create({ ...args.input, status: "pending" }).then(
      (reservation: any) => reservation
    );
  }

  // @VerifyAuthorization
  async cancelReservation(args: any, ctx: any) {
    if (ctx.user.role === "manager") {
      throw new ApolloError(ErrorConstants.PERMISSION_DENIED);
    }
    return await Reservation.findOneAndUpdate(
      { user: args.user, bike: args.bike, status: "pending" },
      { status: "completed" }
    ).then((reservation: any) => reservation);
  }
}

export default BikeController;
