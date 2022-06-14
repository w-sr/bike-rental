import UserController from "../../../controllers/users.controller";
import { Context } from "../../../models/context";

const userController = new UserController();

const userMutations = {
  createUser: async (_: unknown, args: any, ctx: Context) => {
    return userController.addUser(args, ctx);
  },
  updateUser: async (_: unknown, args: any, ctx: Context) => {
    return userController.updateUser(args, ctx);
  },
  deleteUser: async (_: unknown, args: any, ctx: Context) => {
    return userController.deleteUser(args, ctx);
  },
};

export default userMutations;
