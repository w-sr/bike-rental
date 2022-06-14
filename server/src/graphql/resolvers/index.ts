import { AuthenticationError } from "apollo-server-express";
import { comparePassword, getToken } from "../../helpers/authHelpers";
import { User } from "../../models";
import { bikeMutations, bikeQueries } from "./bikes";
import { userMutations, userQueries } from "./users";

const resolvers = {
  Query: {
    me: (_: any, x: any, context: any) => {
      if (context.isUserLogged) {
        return context.user;
      } else {
        throw new AuthenticationError("Please login tagain");
      }
    },
    ...userQueries,
    ...bikeQueries,
  },
  Mutation: {
    login: async (_: unknown, args: any, context: any) => {
      try {
        const user = await User.findOne({ email: args.data.email });
        if (!user) {
          return {
            error: "User not found",
          };
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
          throw new AuthenticationError("Wrong Password");
        }
      } catch (error) {
        console.log(error);
      }
    },
    ...userMutations,
    ...bikeMutations,
  },
};

export default resolvers;
