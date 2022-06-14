import BikeController from "../../../controllers/bikes.controller";
import { Context } from "../../../models/context";

const bikeController = new BikeController();

const bikeMutations = {
  createBike: async (_: unknown, args: any, ctx: Context) => {
    return bikeController.addBike(args, ctx);
  },
  updateBike: async (_: unknown, args: any, ctx: Context) => {
    return bikeController.updateBike(args, ctx);
  },
  deleteBike: async (_: unknown, args: any, ctx: Context) => {
    return bikeController.deleteBike(args, ctx);
  },
};

export default bikeMutations;
