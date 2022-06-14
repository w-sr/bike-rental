import UserControleer from "../../../controllers/users.controller";
import { GraphQLResolveInfo } from "graphql";
import { Context } from "../../../models/context";

const userController = new UserControleer();

const usersQueries = {
  users: async (
    _: unknown,
    args: any,
    ctx: Context,
    _info: GraphQLResolveInfo
  ) => {
    return userController.getUsers(args, ctx);
  },
  user: async (
    _: unknown,
    args: { id: "Uuid" },
    ctx: Context,
    _info: GraphQLResolveInfo
  ) => {
    return userController.getUser(args, ctx);
  },
};

export default usersQueries;
