import BikeController from "../../../controllers/bikes.controller";

const bikeController = new BikeController();

const bikeQueries = {
  bikes: async (_: unknown, args: any, ctx: any) => {
    return bikeController.getBikes(args, ctx);
  },
  bike: async (_: unknown, args: { id: "Uuid" }, ctx: any) => {
    return bikeController.getBike(args, ctx);
  },
};

export default bikeQueries;
