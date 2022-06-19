import { ApolloError } from "apollo-server-errors";
import mongoose from "mongoose";
import { DEFAULT_PASSWORD, UserRole } from "../constants/common.constants";
import { ErrorConstants } from "../constants/errors.constants";
import { VerifyManager } from "../decorators/auth.decorator";
import { encryptPassword } from "../helpers/auth.helpers";
import { User } from "../models";

export class UserController {
  /**
   * Check if role type is correct
   */
  checkRoleInput(role: any) {
    return Object.values(UserRole).every((r) => r !== role);
  }

  /**
   * Get user by id
   */
  @VerifyManager
  async getUser(args: any, ctx: any) {
    if (args._id) {
      throw new ApolloError(ErrorConstants.BAD_REQUEST);
    }
    const result = await User.findById(args._id);
    return result;
  }

  /**
   * Get all users
   */
  @VerifyManager
  async getUsers(args: any, ctx: any) {
    const query: any = { deleted: { $eq: false }, _id: { $ne: ctx.user._id } };
    const {
      filters: { first_name = "", last_name = "", role = "", email = "" } = {},
    } = args;
    const { page, pageSize } = args.filters;

    // Check filter param regarding role
    if (role && this.checkRoleInput(role)) {
      throw new ApolloError(ErrorConstants.BAD_ROLE_INPUT);
    }

    // Make filter query
    if (first_name) {
      query.first_name = {
        $regex: new RegExp(first_name, "i"),
      };
    }
    if (last_name) {
      query.last_name = {
        $regex: new RegExp(last_name, "i"),
      };
    }
    if (email) {
      query.email = {
        $regex: new RegExp(email, "i"),
      };
    }
    if (role) {
      query.role = {
        $regex: new RegExp(role, "i"),
      };
    }

    const count = await User.find(query).count();

    const items = await User.find(query)
      .skip((page - 1) * pageSize)
      .limit(+pageSize);

    return { items, count } as any;
  }

  /**
   * Add user
   */
  @VerifyManager
  async addUser(args: any, ctx: any) {
    const { input: { role = "", email = "" } = {} } = args;

    // check if user with same email is existed or not
    const user = await User.findOne({ email });
    if (user) {
      throw new ApolloError(ErrorConstants.USER_EXISTED);
    }

    // check if role type is correct
    if (this.checkRoleInput(role)) {
      throw new ApolloError(ErrorConstants.BAD_ROLE_INPUT);
    }
    const password = await encryptPassword(DEFAULT_PASSWORD);
    const result = User.create({ ...args.input, password });
    return result;
  }

  /**
   * Update user by id
   */
  @VerifyManager
  async updateUser(args: any, ctx: any) {
    const { input: { role = "", email = "" } = {} } = args;

    let user = await User.findById(args._id);
    if (!user) {
      throw new ApolloError(ErrorConstants.USER_NOT_FOUND);
    }
    if (email && user.email !== email) {
      // check if user with same email is existed or not
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new ApolloError(ErrorConstants.USER_EXISTED);
      }
    }

    // check if role type is correct
    if (this.checkRoleInput(role)) {
      throw new ApolloError(ErrorConstants.BAD_ROLE_INPUT);
    }
    const result = await User.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(args._id) },
      args.input,
      {
        new: true,
      }
    );
    return result;
  }

  /**
   * Delete user by id
   */
  @VerifyManager
  deleteUser(input: any, ctx: any) {
    const result = User.findByIdAndUpdate(input._id, { deleted: true }).then(
      (user: any) => user
    );
    return result;
  }
}

export default UserController;
