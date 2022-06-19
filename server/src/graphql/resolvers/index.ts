import { AuthenticationError } from "apollo-server-express";
import mongoose from "mongoose";
import { UserRole } from "../../constants/common.constants";
import { ErrorConstants } from "../../constants/errors.constants";
import {
  comparePassword,
  encryptPassword,
  getToken,
} from "../../helpers/auth.helpers";
import { User } from "../../models";
import { bikeMutations, bikeQueries } from "./bikes";
import { reservationMutations, reservationQueries } from "./reservations";
import { userMutations, userQueries } from "./users";

const resolvers = {
  Query: {
    /**
     * Retrive user information logged in
     */
    me: async (_: any, x: any, context: any) => {
      if (context.isUserLogged) {
        const user = await User.findOne({
          _id: new mongoose.Types.ObjectId(context.user._id),
          deleted: false,
        });
        return user;
      } else {
        throw new AuthenticationError(ErrorConstants.TRY_AGAIN);
      }
    },
    ...userQueries,
    ...bikeQueries,
    ...reservationQueries,
  },
  Mutation: {
    /**
     * login mutation
     */
    login: async (_: unknown, args: any) => {
      const user = await User.findOne({ email: args.data.email });
      if (!user) {
        throw new AuthenticationError(ErrorConstants.USER_NOT_FOUND);
      }
      const isMatch = await comparePassword(args.data.password, user.password);
      if (isMatch) {
        const input = { _id: user._id, role: user.role };
        const token = getToken(input);
        return { user, token };
      } else {
        throw new AuthenticationError(ErrorConstants.WRONG_PASSWORD);
      }
    },
    register: async (_: unknown, args: any) => {
      const user = await User.findOne({ email: args.data.email });
      if (user) {
        throw new AuthenticationError(ErrorConstants.USER_EXISTED);
      }
      const password = await encryptPassword(args.data.password);
      const regUser = await User.create({
        ...args.data,
        role: UserRole.User,
        password,
      });
      const input = { _id: regUser._id, role: regUser.role };
      const token = getToken(input);
      return { user: regUser, token };
    },
    ...userMutations,
    ...bikeMutations,
    ...reservationMutations,
  },
};

export default resolvers;
