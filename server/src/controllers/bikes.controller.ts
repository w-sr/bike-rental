import { Bike } from "../models";
import { Context } from "../models/context";
// import { VerifyAuthorization } from "../decorators/auth.decorator";

export class BikeController {
  // @VerifyAuthorization
  async getBike(args: any, ctx: Context) {
    return Bike.find({ id: args["id"] }).then((bikes: any) => bikes[0]);
  }

  // @VerifyAuthorization
  async getBikes(args: any, ctx: Context) {
    const { input: { model = "", color = "", location = "", rate = "" } = {} } =
      args;
    const query: any = {};

    if (model) {
      query.model = {
        $regex: new RegExp(model, "g"),
      };
    }
    if (color) {
      query.color = color;
    }
    if (location) {
      query.location = location;
    }
    if (rate) {
      query.rating = parseInt(rate);
    }
    return Bike.find(query);
  }

  // @VerifyAuthorization
  async addBike(input: any, ctx: any) {
    return Bike.create({ ...input.input, rating: 0, rented: false }).then(
      (bike: any) => bike
    );
  }

  // @VerifyAuthorization
  async updateBike(input: any, ctx: any) {
    return Bike.findOneAndUpdate({ id: input.id }, input.input, {
      new: true,
    }).then((bike: any) => bike);
  }

  // @VerifyAuthorization
  async deleteBike(input: any, ctx: any) {
    return Bike.findOneAndDelete({ id: input.id }).then((bike: any) => bike);
  }
}

export default BikeController;
