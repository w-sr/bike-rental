import { ApolloError } from "apollo-server-errors";
import mongoose from "mongoose";
import { ReserveStatus } from "../constants/common.constants";
import { ErrorConstants } from "../constants/errors.constants";
import { VerifyManager, VerifyUser } from "../decorators/auth.decorator";
import { Bike, Reservation } from "../models";

export class ReservationController {
  /**
   * Get a reservation by id
   */
  @VerifyManager
  async getReservation(args: any, ctx: any) {
    if (!args._id) {
      throw new ApolloError(ErrorConstants.BAD_REQUEST);
    }
    const result = await Reservation.findById(args._id);
    return result;
  }

  /**
   * Get all reservations
   */
  @VerifyManager
  async getReservations(args: any, ctx: any) {
    const filters = args.filters;
    const { page, pageSize } = filters;
    let query: any = {};
    if (filters.user) {
      query.user = new mongoose.Types.ObjectId(filters.user);
    }

    if (filters.bike) {
      query.bike = new mongoose.Types.ObjectId(filters.bike);
    }

    const count =
      (
        await Reservation.aggregate([
          {
            $match: query,
          },
          {
            $count: "count",
          },
        ])
      )[0]?.count || 0;

    const items = await Reservation.aggregate([
      {
        $match: query,
      },
      {
        $skip: (page - 1) * pageSize,
      },
      {
        $limit: +pageSize,
      },
      {
        $lookup: {
          from: "bikes",
          localField: "bike",
          foreignField: "_id",
          as: "bike",
        },
      },
      {
        $unwind: { path: "$bike", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
      },
    ]).exec();

    return { items, count } as any;
  }

  /**
   * Add new reservation
   */
  @VerifyUser
  async addReservation(args: any, ctx: any) {
    const {
      input: { bike = "", start_date = "", end_date = "" },
    } = args;

    // start date should be greater than today
    const date = new Date(start_date).toISOString().split("T")[0];
    const today = new Date().toISOString().split("T")[0];
    if (date < today) {
      throw new ApolloError(ErrorConstants.BAD_START_DATE);
    }

    // end date should be greater than start date.
    if (start_date > end_date) {
      throw new ApolloError(ErrorConstants.BAD_END_DATE);
    }

    // make a query to check availability to reserve
    const query: any = [
      { bike: { $eq: new mongoose.Types.ObjectId(bike) } },
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
    ];

    const reservation = await Reservation.find({ $and: query });
    if (reservation.length > 0) {
      throw new ApolloError(ErrorConstants.ALREADY_RESERVED);
    }

    const result = await Reservation.create({
      ...args.input,
      user: ctx.user._id,
      status: ReserveStatus.Pending,
    });

    return result;
  }

  /**
   * Cancel reservation
   */
  @VerifyUser
  async cancelReservation(args: any, ctx: any) {
    if (!args.input.bike) {
      throw new ApolloError(ErrorConstants.BAD_REQUEST);
    }
    const updateReservationPayload: any = { status: ReserveStatus.Completed };
    if (args.input.rate) {
      updateReservationPayload.rate = parseFloat(args.input.rate);

      const bike = await Bike.findById(args.input.bike).select("rate");
      const rateReservationCount = await Reservation.find({
        rate: { $gte: 1 },
        bike: args.input.bike,
      }).count();

      bike.rate = Number(
        (
          (bike.rate * rateReservationCount + updateReservationPayload.rate) /
          (rateReservationCount + 1)
        ).toFixed(2)
      );

      await bike.save();
    }
    const result = await Reservation.findOneAndUpdate(
      {
        user: new mongoose.Types.ObjectId(ctx.user._id),
        bike: new mongoose.Types.ObjectId(args.input.bike),
        status: ReserveStatus.Pending,
      },
      updateReservationPayload
    );

    return result;
  }
}

export default ReservationController;
