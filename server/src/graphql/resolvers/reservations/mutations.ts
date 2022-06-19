import ReservationController from "../../../controllers/reservations.controller";

const reservationController = new ReservationController();

const reservationMutations = {
  createReservation: async (_: unknown, args: any, ctx: any) => {
    return reservationController.addReservation(args, ctx);
  },
  cancelReservation: async (_: unknown, args: any, ctx: any) => {
    return reservationController.cancelReservation(args, ctx);
  },
};

export default reservationMutations;
