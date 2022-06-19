import { connection } from "mongoose";
import { DEFAULT_PASSWORD } from "../constants/common.constants";
import { encryptPassword } from "../helpers/auth.helpers";
import { MongoHelper } from "../helpers/mongo.helpers";
import { Bike, User } from "../models";

const mongoHelper = new MongoHelper();
const seed = async () => {
  console.log("Cleanning database");

  await mongoHelper.connectDB();
  await connection.dropDatabase();

  console.log("Database clean");
  const password = await encryptPassword(DEFAULT_PASSWORD);

  const user = new User({
    first_name: "Manager1",
    last_name: "Manager1",
    email: "admin@email.com",
    password,
    role: "manager",
  });

  const users = [user];

  const bikes = [
    new Bike({
      model: "Allston",
      color: "white",
      location: "New York",
      rate: "0",
    }),
    new Bike({
      model: "Fit",
      color: "blue",
      location: "Boston",
      rate: "0",
    }),
    new Bike({
      model: "Urban",
      color: "red",
      location: "Los Angeles",
      rate: "0",
    }),
    new Bike({
      model: "Boston",
      color: "pink",
      location: "Austin",
      rate: "0",
    }),
    new Bike({
      model: "Crosstown",
      color: "green",
      location: "Chicago",
      rate: "0",
    }),
  ];

  const savings = [
    ...bikes.map((bike) => bike.save()),
    ...users.map((user) => user.save()),
  ];

  await Promise.all(savings);

  console.log("Database seeded");

  connection.close();
};

seed();
