import { ApolloServer } from "apollo-server-express";
import { ErrorConstants } from "../constants/errors.constants";
import { MongoHelper } from "../helpers/mongo.helpers";
import schema from "./schema";
import { validateUser } from "../middlewares/auth.middleware";

const mHelper = new MongoHelper();

mHelper.connectDB();

const setHttpPlugin = {
  async requestDidStart() {
    return {
      async willSendResponse({ response }: any) {
        if (
          response?.errors?.[0]?.message ===
            ErrorConstants.USER_NOT_AUTHORIZED ||
          response?.errors?.[0]?.message === ErrorConstants.USER_NOT_FOUND ||
          response?.errors?.[0]?.message === ErrorConstants.USER_EXISTED
        ) {
          response.http.status = 401;
        } else if (
          response?.errors?.[0]?.message === ErrorConstants.WRONG_PASSWORD
        ) {
          response.http.status = 400;
        } else if (
          response?.errors?.[0]?.message === ErrorConstants.PERMISSION_DENIED
        ) {
          response.http.status = 403;
        }
      },
    };
  },
};

const apolloServer = new ApolloServer({
  schema,
  introspection: true,
  context: async ({ req }) => {
    if (!req.body.query.match("login") && !req.body.query.match("register")) {
      return await validateUser(req);
    }
  },
  plugins: [setHttpPlugin],
});

export default apolloServer;
