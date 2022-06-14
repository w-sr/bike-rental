import { ApolloServer } from "apollo-server-express";
import { ErrorConstants } from "../constants/errors.constants";
import { MongoHelper } from "../helpers/mongoHelpers";
import schema from "./schema";

const mHelper = new MongoHelper();

mHelper.connectDB();

const setHttpPlugin = {
  async requestDidStart() {
    return {
      async willSendResponse({ response }: any) {
        if (
          response?.errors?.[0]?.message === ErrorConstants.USER_NOT_AUTHORIZED
        ) {
          response.http.status = 401;
        }
      },
    };
  },
};

const apolloServer = new ApolloServer({
  schema,
  introspection: true,
  context: async ({ req }) => {
    return await mHelper.validateUser(req);
  },
  plugins: [setHttpPlugin],
});

export default apolloServer;
