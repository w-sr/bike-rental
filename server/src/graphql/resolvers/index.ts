import { AuthenticationError } from "apollo-server-express";
import { ErrorConstants } from "../../constants/errors.constants";
import {
  comparePassword,
  encryptPassword,
  getToken,
} from "../../helpers/authHelpers";
import { User } from "../../models";
import { bikeMutations, bikeQueries } from "./bikes";
import { reservationMutations, reservationQueries } from "./reservations";
import { userMutations, userQueries } from "./users";

const resolvers = {
  Query: {
    me: (_: any, x: any, context: any) => {
      if (context.isUserLogged) {
        return context.user;
      } else {
        throw new AuthenticationError("Please login again");
      }
    },
    ...userQueries,
    ...bikeQueries,
    ...reservationQueries,
  },
  Mutation: {
    login: async (_: unknown, args: any) => {
      try {
        const user = await User.findOne({ email: args.data.email });
        if (!user) {
          throw new AuthenticationError(ErrorConstants.USER_NOT_FOUND);
        }
        const isMatch = await comparePassword(
          args.data.password,
          user.password
        );
        if (isMatch) {
          const input = { email: user.email };
          const token = getToken(input);
          return { user, token };
        } else {
          throw new AuthenticationError(ErrorConstants.WRONG_PASSWORD);
        }
      } catch (error) {
        throw error;
      }
    },
    register: async (_: unknown, args: any) => {
      try {
        const user = await User.findOne({ email: args.data.email });
        if (user) {
          throw new AuthenticationError(ErrorConstants.USER_EXISTED);
        }
        const password = await encryptPassword(args.data.password);
        const regUser = await User.create({
          ...args.data,
          role: "user",
          password,
        });
        const input = { email: regUser.email };
        const token = getToken(input);
        return { user: regUser, token };
      } catch (error) {
        throw error;
      }
    },
    ...userMutations,
    ...bikeMutations,
    ...reservationMutations,
  },
};

export default resolvers;
