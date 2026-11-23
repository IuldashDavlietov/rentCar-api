/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */

import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../configs/env";
import CustomError from "../helpers/customError";
import type { AccessData } from "../types/api";

// jwt.verify returns "string | JwtPayload", so we check it has the fields we signed.
const isAccessData = (value: unknown): value is AccessData =>
  typeof value === "object" &&
  value !== null &&
  "_id" in value &&
  "username" in value &&
  "isActive" in value &&
  "isAdmin" in value &&
  "isStaff" in value;

const authentication: RequestHandler = (req, res, next) => {
  req.user = undefined;

  const auth = req.headers.authorization; // Bearer ...accessKey...
  const [tokenType, tokenKey] = auth ? auth.split(" ") : []; //  ['Bearer', '...accessKey...']

  if (tokenType === "Bearer" && tokenKey) {
    try {
      const accessData = jwt.verify(tokenKey, env.ACCESS_KEY);

      req.user = isAccessData(accessData) ? accessData : undefined;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new CustomError("JWT Error : " + message, 401);
    }
  }

  next();
};

export default authentication;
