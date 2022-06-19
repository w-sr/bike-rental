import { AuthenticationError } from "apollo-server-errors";
import * as jwt from "jsonwebtoken";
import { AUTH_SALT } from "../../configs/environment";
import { ErrorConstants } from "../constants/errors.constants";

export const validateUser = async (req: any) => {
  const token = req.headers.authorization || "";
  try {
    const payload = <{ id: string; iat: number }>(
      jwt.verify(token, <string>AUTH_SALT)
    );
    return { isUserLogged: true, user: payload };
  } catch (error) {
    throw new AuthenticationError(ErrorConstants.USER_NOT_AUTHORIZED);
  }
};
