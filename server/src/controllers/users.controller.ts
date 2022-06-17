import { ApolloError } from "apollo-server-errors";
import mongoose from "mongoose";
import { ErrorConstants } from "../constants/errors.constants";
import { DEFAULT_PASSWORD } from "../constants/common";
import { VerifyAuthorization } from "../decorators/auth.decorator";
import { encryptPassword } from "../helpers/authHelpers";
import { User } from "../models";
import { Context } from "../models/context";

export class UserController {
  // @VerifyAuthorization
  async getUser(args: any, ctx: Context) {
    return User.find({ id: args["id"] }).then((users: any) => users[0]);
  }

  // @VerifyAuthorization
  async getUsers(args: any, ctx: any) {
    if (ctx.user.role === "user") {
      throw new ApolloError(ErrorConstants.PERMISSION_DENIED);
    }
    const query: any = { deleted: { $eq: false }, _id: { $ne: ctx.user.id } };
    return User.find(query).then((users: any) => users);
  }

  // @VerifyAuthorization
  async addUser(input: any, ctx: any) {
    if (ctx.user.role === "user") {
      throw new ApolloError(ErrorConstants.PERMISSION_DENIED);
    }
    const password = await encryptPassword(DEFAULT_PASSWORD);
    return User.create({ ...input.input, password }).then((user: any) => user);
  }

  // @VerifyAuthorization
  async updateUser(input: any, ctx: any) {
    if (ctx.user.role === "user") {
      throw new ApolloError(ErrorConstants.PERMISSION_DENIED);
    }
    return User.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(input.id) },
      input.input,
      {
        new: true,
      }
    ).then((user: any) => user);
  }

  // @VerifyAuthorization
  async deleteUser(input: any, ctx: any) {
    if (ctx.user.role === "user") {
      throw new ApolloError(ErrorConstants.PERMISSION_DENIED);
    }
    return User.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(input.id),
      },
      { deleted: true }
    ).then((user: any) => user);
  }
}

export default UserController;
