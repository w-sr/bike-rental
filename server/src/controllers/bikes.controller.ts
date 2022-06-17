import { ApolloError } from "apollo-server-errors";
import mongoose from "mongoose";
import { ErrorConstants } from "../constants/errors.constants";
import { Bike, Reservation } from "../models";
import { Context } from "../models/context";
import { VerifyAuthorization } from "../decorators/auth.decorator";

export class BikeController {
  // @VerifyAuthorization
  async getBike(args: any, ctx: Context) {
    return Bike.find({ id: args["id"] }).then((bikes: any) => bikes[0]);
  }

  // @VerifyAuthorization
  async getBikes(args: any, ctx: any) {
    const {
      input: {
        model = "",
        color = "",
        location = "",
        rate = "",
        start_date = "",
        end_date = "",
      } = {},
    } = args;
    const query: any = { deleted: { $eq: false } };

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
      query.rate = {
        $gte: parseInt(rate),
      };
    }
    if (ctx.user.role === "user") {
      const reservations = await Reservation.find()
        .populate({
          path: "bike",
          model: "Bike",
        })
        .populate({
          path: "user",
          model: "User",
        })
        .lean();
      const bikes = await Bike.find(query).lean();
      const myBikes = reservations.reduce((sum: any, current: any) => {
        if (
          current.user.email === ctx.user.email &&
          current.status === "pending"
        ) {
          sum.push(current.bike);
        }
        return sum;
      }, []);
      const availableBikes = bikes.filter((bike: any) => {
        const isNotExisted = reservations.every(
          (reservation: any) => !reservation.bike._id.equals(bike._id)
        );
        if (isNotExisted) return true;

        const isNotPending = reservations
          .filter((reservation: any) => reservation.bike._id.equals(bike._id))
          .every((reservation: any) => reservation.status === "completed");
        if (isNotPending) return true;

        const real = reservations.filter(
          (reservation: any) =>
            reservation.bike._id.equals(bike._id) &&
            reservation.status === "pending" &&
            (reservation.start_date > end_date ||
              reservation.end_date < start_date)
        );
        if (real.length > 0) return true;
        return false;
      });
      return { myBikes, availableBikes };
    } else if (ctx.user.role === "manager") {
      const availableBikes = await Bike.find(query).lean();
      return { myBikes: [], availableBikes };
    }
    // const query = {
    //   status: "completed"
    // }
    // return Reservation.find({
    //   user: ctx.user.id,
    //   status: "pending",
    // })
    //   .populate({
    //     path: "bike",
    //     model: "Bike",
    //   })
    //   .populate({
    //     path: "user",
    //     model: "User",
    //   })
    //   .then((reservations: any) =>
    //     reservations.map((reserve: any) => reserve.bike)
    //   );
    // const {
    //   input: {
    //     model = "",
    //     color = "",
    //     location = "",
    //     rate = "",
    //     start_date = "",
    //     end_date = "",
    //   } = {},
    // } = args;
    // const query: any = { deleted: { $eq: false } };

    // if (model) {
    //   query.model = {
    //     $regex: new RegExp(model, "g"),
    //   };
    // }
    // if (color) {
    //   query.color = color;
    // }
    // if (location) {
    //   query.location = location;
    // }
    // if (rate) {
    //   query.rate = {
    //     $gte: parseInt(rate),
    //   };
    // }
    // if (start_date) {
    //   query.start_date = {};
    // }
    // return Bike.find({}).then((bikes: any) => bikes);
  }

  // @VerifyAuthorization
  async addBike(input: any, ctx: any) {
    if (ctx.user.role === "user") {
      throw new ApolloError(ErrorConstants.PERMISSION_DENIED);
    }

    return Bike.create({ ...input.input, rate: 0, reserved: false }).then(
      (bike: any) => bike
    );
  }

  // @VerifyAuthorization
  async updateBike(input: any, ctx: any) {
    const { input: { model = "", color = "", location = "", rate = "" } = {} } =
      input;
    if (ctx.user.role === "user") {
      if (model || color || location) {
        throw new ApolloError(ErrorConstants.PERMISSION_DENIED);
      }
    }
    if (ctx.user.role === "manager") {
      if (rate) {
        throw new ApolloError(ErrorConstants.PERMISSION_DENIED);
      }
    }

    return Bike.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(input.id),
      },
      input.input,
      {
        new: true,
      }
    ).then((bike: any) => bike);
  }

  // @VerifyAuthorization
  async deleteBike(input: any, ctx: any) {
    if (ctx.user.role === "user") {
      throw new ApolloError(ErrorConstants.PERMISSION_DENIED);
    }

    return Bike.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(input.id),
      },
      { deleted: true }
    ).then((bike: any) => bike);
  }
}

export default BikeController;
