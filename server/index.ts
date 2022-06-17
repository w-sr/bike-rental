import express from "express";
import { PORT } from "./configs/environment";
import graphqlServer from "./src/graphql";

const app: express.Application = express();

const start = async () => {
  try {
    await graphqlServer.start();
    graphqlServer.applyMiddleware({
      app,
      path: "/graphql",
    });
    app.listen(PORT, "192.168.10.220");
    console.log(`GraphQL server running at port: ${PORT}`);
  } catch {
    console.log("Not able to run GraphQL server");
  }
};

start();
