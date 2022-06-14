import { User } from "../models";
import { Context } from "../models/context";
import { VerifyAuthorization } from "../decorators/auth.decorator";

export class UserController {
  @VerifyAuthorization
  async getUser(args: any, ctx: Context) {
    return User.find({ id: args["id"] }).then((users: any) => users[0]);
  }

  @VerifyAuthorization
  async getUsers(args: any, ctx: Context) {
    return User.find().then((users: any) => users);
  }

  @VerifyAuthorization
  async addUser(input: any, ctx: any) {
    return User.create(input.input).then((user: any) => user);
  }

  @VerifyAuthorization
  async updateUser(input: any, ctx: any) {
    return User.findOneAndUpdate({ id: input.id }, input.input, {
      new: true,
    }).then((user: any) => user);
  }

  @VerifyAuthorization
  async deleteUser(input: any, ctx: any) {
    return User.findOneAndDelete({ id: input.id }).then((user: any) => user);
  }
}

export default UserController;
