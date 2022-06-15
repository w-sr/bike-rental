import { User, Bike, Reservation } from "../models";
import { Context } from "../models/context";
import { VerifyAuthorization } from "../decorators/auth.decorator";

export class BikeController {
  @VerifyAuthorization
  async getReservation(args: any, ctx: Context) {
    return Reservation.find({ id: args["id"] }).then(
      (reservations: any) => reservations[0]
    );
  }

  @VerifyAuthorization
  async getReservations(args: any, ctx: Context) {
    return Reservation.find()
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

  @VerifyAuthorization
  async addReservation(input: any, ctx: any) {
    return Reservation.create(input.input).then(
      (reservation: any) => reservation
    );
  }

  // @VerifyAuthorization
  // async updateBike(input: any, ctx: any) {
  //   return Bike.findOneAndUpdate({ id: input.id }, input.input, {
  //     new: true,
  //   }).then((bike: any) => bike);
  // }

  // @VerifyAuthorization
  // async deleteBike(input: any, ctx: any) {
  //   return Bike.findOneAndDelete({ id: input.id }).then((bike: any) => bike);
  // }
}

export default BikeController;
