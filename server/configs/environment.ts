import * as dotenv from "dotenv";
dotenv.config();
import * as env from "env-var";

export const PORT = env.get("PORT").default("4000").asPortNumber();
export const DB_HOST = env.get("DB_HOST").required().asString();
export const DB_NAME = env.get("DB_NAME").required().asString();
export const DB_PORT = env.get("DB_PORT").required().asString();
export const DB_USER = env.get("DB_USER").asString();
export const DB_PASS = env.get("DB_PASS").asString();
export const AUTH_SALT = env.get("AUTH_SALT").required().asString();
