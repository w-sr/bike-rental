import UserController from "../../../controllers/users.controller";

const userController = new UserController();

const userMutations = {
  createUser: async (_: unknown, args: any, ctx: any) => {
    return userController.addUser(args, ctx);
  },
  updateUser: async (_: unknown, args: any, ctx: any) => {
    return userController.updateUser(args, ctx);
  },
  deleteUser: async (_: unknown, args: any, ctx: any) => {
    return userController.deleteUser(args, ctx);
  },
};

export default userMutations;
