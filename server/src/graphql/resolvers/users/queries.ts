import UserController from "../../../controllers/users.controller";

const userController = new UserController();

const usersQueries = {
  users: async (_: unknown, args: any, ctx: any) => {
    return userController.getUsers(args, ctx);
  },
  user: async (_: unknown, args: { id: "Uuid" }, ctx: any) => {
    return userController.getUser(args, ctx);
  },
};

export default usersQueries;
