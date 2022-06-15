import mongoose from "mongoose";
import { DEFAULT_PASSWORD } from "../constants/common";
import { VerifyAuthorization } from "../decorators/auth.decorator";
import { encryptPassword } from "../helpers/authHelpers";
import { User } from "../models";
import { Context } from "../models/context";

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
    const password = await encryptPassword(DEFAULT_PASSWORD);
    return User.create({ ...input.input, password }).then((user: any) => user);
  }

  @VerifyAuthorization
  async updateUser(input: any, ctx: any) {
    return User.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(input.id) },
      input.input,
      {
        new: true,
      }
    ).then((user: any) => user);
  }

  @VerifyAuthorization
  async deleteUser(input: any, ctx: any) {
    return User.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(input.id),
    }).then((user: any) => user);
  }
}

export default UserController;
