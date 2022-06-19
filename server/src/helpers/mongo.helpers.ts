
import Mongoose from "mongoose";
import {
  AUTH_SALT,
  DB_HOST,
  DB_NAME,
  DB_PASS,
  DB_PORT,
  DB_USER,
} from "../../configs/environment";

// Move to connectDB
const dbURL = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
const options: Mongoose.ConnectOptions = {
  autoIndex: true,
};

if (DB_USER && DB_PASS) {
  options.user = DB_USER;
  options.pass = DB_PASS;
}
// end

export class MongoHelper {
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
