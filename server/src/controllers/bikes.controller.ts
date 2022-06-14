import { Bike } from "../models";
import { Context } from "../models/context";
import { VerifyAuthorization } from "../decorators/auth.decorator";

export class BikeController {
  @VerifyAuthorization
  async getBike(args: any, ctx: Context) {
    return Bike.find({ id: args["id"] }).then((bikes: any) => bikes[0]);
  }

  @VerifyAuthorization
  async getBikes(args: any, ctx: Context) {
    return Bike.find().then((bikes: any) => bikes);
  }

  @VerifyAuthorization
  async addBike(input: any, ctx: any) {
    return Bike.create(input.input).then((food: any) => food);
  }

  @VerifyAuthorization
  async updateBike(input: any, ctx: any) {
    return Bike.findOneAndUpdate({ id: input.id }, input.input, {
      new: true,
    }).then((food: any) => food);
  }

  @VerifyAuthorization
  async deleteBike(input: any, ctx: any) {
    return Bike.findOneAndDelete({ id: input.id }).then((food: any) => food);
  }
}

export default BikeController;
