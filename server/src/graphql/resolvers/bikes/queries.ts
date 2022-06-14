import BikesController from "../../../controllers/bikes.controller";
import { GraphQLResolveInfo } from "graphql";
import { Context } from "../../../models/context";

const bikeController = new BikesController();

const bikeQueries = {
  bikes: async (
    _: unknown,
    args: any,
    ctx: Context,
    _info: GraphQLResolveInfo
  ) => {
    return bikeController.getBikes(args, ctx);
  },
  bike: async (
    _: unknown,
    args: { id: "Uuid" },
    ctx: Context,
    _info: GraphQLResolveInfo
  ) => {
    return bikeController.getBike(args, ctx);
  },
};

export default bikeQueries;
