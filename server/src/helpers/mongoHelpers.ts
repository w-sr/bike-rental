import { AuthenticationError } from "apollo-server-errors";
import * as jwt from "jsonwebtoken";
import Mongoose from "mongoose";
import { ErrorConstants } from "../constants/errors.constants";
import {
  AUTH_SALT,
  DB_HOST,
  DB_NAME,
  DB_PASS,
  DB_PORT,
  DB_USER,
} from "../../configs/environment";
import User from "../models/user";

const dbURL = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
const options: Mongoose.ConnectOptions = {
  autoIndex: true,
};

if (DB_USER && DB_PASS) {
  options.user = DB_USER;
  options.pass = DB_PASS;
}

export class MongoHelper {
  public async validateUser(req: any) {
    const token = req.headers.authorization || "";
    try {
      const payload = <{ email: string; iat: number }>(
        jwt.verify(token, <string>AUTH_SALT)
      );
      const email = payload["email"];
      return await User.find({ email: email }).then((response: any) => {
        if (response.length > 0) {
          return { isUserLogged: true, user: response[0] };
        }
        throw new AuthenticationError(ErrorConstants.USER_NOT_AUTHORIZED);
      });
    } catch (error) {
      throw new AuthenticationError(ErrorConstants.USER_NOT_AUTHORIZED);
    }
  }

  public async connectDB(): Promise<Mongoose.Connection> {
    try {
      await Mongoose.connect(dbURL, options);
      console.log("<<<<< Connected to MongoDB >>>>>");

      Mongoose.Promise = global.Promise; // Get Mongoose to use the global promise library
      const db: Mongoose.Connection = Mongoose.connection; // Get the default connection
      return db;
    } catch (error) {
      console.error("Mongo Connection Error: ", error);
      process.exit(1);
    }
  }
}
