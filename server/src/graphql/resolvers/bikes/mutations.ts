import BikeController from "../../../controllers/bikes.controller";

const bikeController = new BikeController();

const bikeMutations = {
  createBike: async (_: unknown, args: any, ctx: any) => {
    return bikeController.addBike(args, ctx);
  },
  updateBike: async (_: unknown, args: any, ctx: any) => {
    return bikeController.updateBike(args, ctx);
  },
  deleteBike: async (_: unknown, args: any, ctx: any) => {
    return bikeController.deleteBike(args, ctx);
  },
};

export default bikeMutations;
