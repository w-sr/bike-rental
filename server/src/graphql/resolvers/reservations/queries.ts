import ReservationController from "../../../controllers/reservations.controller";

const reservationController = new ReservationController();

const reservationQueries = {
  reservations: async (_: unknown, args: any, ctx: any) => {
    return reservationController.getReservations(args, ctx);
  },
  reservation: async (_: unknown, args: { id: "Uuid" }, ctx: any) => {
    return reservationController.getReservation(args, ctx);
  },
};

export default reservationQueries;
