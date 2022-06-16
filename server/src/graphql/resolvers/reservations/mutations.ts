import ReservationController from "../../../controllers/reservations.controller";
import { Context } from "../../../models/context";

const reservationController = new ReservationController();

const reservationMutations = {
  createReservation: async (_: unknown, args: any, ctx: Context) => {
    return reservationController.addReservation(args, ctx);
  },
  cancelReservation: async (_: unknown, args: any, ctx: Context) => {
    return reservationController.cancelReservation(args, ctx);
  },
};

export default reservationMutations;
