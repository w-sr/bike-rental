import { ApolloError } from "apollo-server-errors";
import mongoose from "mongoose";
import { ReserveStatus, UserRole } from "../constants/common.constants";
import { ErrorConstants } from "../constants/errors.constants";
import { VerifyManager } from "../decorators/auth.decorator";
import { Bike, Reservation } from "../models";

export class BikeController {
  /**
   * Get a bike by id
   */
  getBike(args: any, ctx: any) {
    if (args._id) {
      throw new ApolloError(ErrorConstants.BAD_REQUEST);
    }
    const result = Bike.findById(args._id);
    return result;
  }

  /**
   * Get all bikes
   */
  async getBikes(args: any, ctx: any) {
    const {
      filters: {
        model = "",
        color = "",
        location = "",
        rate = "",
        start_date = "",
        end_date = "",
        user = "",
      } = {},
    } = args;
    const query: any = { deleted: { $eq: false } };

    if (model) {
      query.model = {
        $regex: new RegExp(model, "i"),
      };
    }
    if (color) {
      query.color = {
        $regex: new RegExp(color, "i"),
      };
    }
    if (location) {
      query.location = {
        $regex: new RegExp(location, "i"),
      };
    }
    if (rate) {
      query.rate = {
        $gte: parseInt(rate),
      };
      if (parseFloat(rate) > 5.0) {
        throw new ApolloError(ErrorConstants.BAD_RATE_INPUT);
      }
    }

    if (ctx.user.role === UserRole.User) {
      if (user) {
        const userReservedBikeIds =
          (await Reservation.distinct("bike", {
            $and: [
              {
                user: { $eq: new mongoose.Types.ObjectId(user) },
              },
              { status: { $eq: ReserveStatus.Pending } },
            ],
          })) || [];
        query._id = {
          $in: userReservedBikeIds,
        };
      } else {
        const reservedBikeIds =
          (await Reservation.distinct("bike", {
            $and: [
              { status: { $eq: ReserveStatus.Pending } },
              {
                $or: [
                  {
                    $and: [
                      { start_date: { $gte: start_date } },
                      { start_date: { $lte: end_date } },
                    ],
                  },
                  {
                    $and: [
                      { end_date: { $gte: start_date } },
                      { end_date: { $lte: end_date } },
                    ],
                  },
                ],
              },
            ],
          })) || [];

        query._id = {
          $nin: reservedBikeIds,
        };
      }
    }

    const bikes = await Bike.find(query).lean();
    return bikes;
  }

  /**
   * Add a new bike
   */
  @VerifyManager
  addBike(args: any, ctx: any) {
    const { input } = args;
    if (!input.model) {
      throw new ApolloError(ErrorConstants.BAD_REQUEST);
    }
    if (!input.color) {
      throw new ApolloError(ErrorConstants.BAD_REQUEST);
    }
    if (!input.location) {
      throw new ApolloError(ErrorConstants.BAD_REQUEST);
    }

    const result = Bike.create({ ...input });

    return result;
  }

  /**
   * Update a bike by id
   */
  async updateBike(input: any, ctx: any) {
    const { input: { model = "", color = "", location = "" } = {} } = input;

    // user can't update model, color, location of bike
    if (ctx.user.role === UserRole.User) {
      if (model || color || location) {
        throw new ApolloError(ErrorConstants.PERMISSION_DENIED);
      }
    }

    const result = await Bike.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(input._id),
      },
      input.input,
      {
        new: true,
      }
    );

    return result;
  }

  /**
   * Delete a bike by id
   */
  @VerifyManager
  async deleteBike(input: any, ctx: any) {
    if (!input._id) {
      return new ApolloError(ErrorConstants.BAD_REQUEST);
    }
    const result = await Bike.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(input._id),
      },
      { deleted: true }
    );
    return result;
  }
}

export default BikeController;
