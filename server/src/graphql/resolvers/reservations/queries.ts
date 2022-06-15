import ReservationsController from "../../../controllers/reservations.controller";
import { GraphQLResolveInfo } from "graphql";
import { Context } from "../../../models/context";

const reservationController = new ReservationsController();

const reservationQueries = {
  reservations: async (
    _: unknown,
    args: any,
    ctx: Context,
    _info: GraphQLResolveInfo
  ) => {
    return reservationController.getReservations(args, ctx);
  },
  reservation: async (
    _: unknown,
    args: { id: "Uuid" },
    ctx: Context,
    _info: GraphQLResolveInfo
  ) => {
    return reservationController.getReservation(args, ctx);
  },
};

export default reservationQueries;
