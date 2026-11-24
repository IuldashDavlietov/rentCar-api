import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import type { QueryFilter } from "mongoose";
import { env } from "../configs/env";
import CustomError from "../helpers/customError";
import passwordValidation from "../helpers/passwordValidation";
import User from "../models/user.model";
import type { IUser, UserBody, UserDocument } from "../models/user.model";
import type {
  AccessData,
  DataResponse,
  LoginBody,
  LoginResponse,
  MessageResponse,
  RefreshBody,
  RefreshResponse,
} from "../types/api";

const createAccessToken = (user: UserDocument): string => {
  const accessData: AccessData = {
    _id: user._id.toString(),
    username: user.username,
    isActive: user.isActive,
    isAdmin: user.isAdmin,
    isStaff: user.isStaff,
  };

  // jwt.sign(payload, accessKey, options)
  return jwt.sign(accessData, env.ACCESS_KEY, { expiresIn: "15m" });
};

// jwt.verify returns "string | JwtPayload", so we check it has the field we signed.
const isRefreshData = (value: unknown): value is { _id: string } =>
  typeof value === "object" && value !== null && "_id" in value && typeof value._id === "string";

type LoginHandler = RequestHandler<{}, LoginResponse, LoginBody>;
const login: LoginHandler = async (req, res) => {
  /*
      #swagger.tags = ["Authentication"]
      #swagger.summary = "Login"
      #swagger.description = 'Login with username (or email) and password for get simpleToken and JWT'
      #swagger.parameters["body"] = {
          in: "body",
          required: true,
          schema: {
              "username": "test",
              "password": "aA12345.?",
          }
      }
  */
  const { username, email, password } = req.body;

  // Types are gone at runtime, so we check what the client really sent.
  const loginFields: QueryFilter<IUser>[] = [];
  if (typeof username === "string" && username) loginFields.push({ username });
  if (typeof email === "string" && email) loginFields.push({ email });

  if (!loginFields.length || typeof password !== "string" || !password)
    throw new CustomError("Username/Email and Password are required.", 401);

  const user = await User.findOne({ $or: loginFields, password });

  if (!user) throw new CustomError("Incorrect Username/Email or Password.", 401);
  if (!user.isActive) throw new CustomError("This account is not active.", 401);

  // JWT
  const access = createAccessToken(user);
  const refresh = jwt.sign({ _id: user._id.toString() }, env.REFRESH_KEY, { expiresIn: "1d" });
  // JWT

  res.status(200).send({
    error: false,
    bearer: { access, refresh },
  });
};

type RegisterHandler = RequestHandler<{}, DataResponse<UserDocument>, UserBody>;
const register: RegisterHandler = async (req, res) => {
  /*
    #swagger.tags = ["Authentication"]
    #swagger.summary = "Register User"
    #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: {
        "username": "test",
        "password": "1234",
        "email": "test@site.com",
        "isActive": true,
        "isStaff": false,
        "isAdmin": false,
      }
    }
  */
  passwordValidation(req.body.password);
  const data = await User.create(req.body);
  res.status(201).send({
    error: false,
    data,
  });
};

type LogoutHandler = RequestHandler<{}, MessageResponse>;
const logout: LogoutHandler = async (req, res) => {
  /*
     #swagger.tags = ["Authentication"]
     #swagger.summary = "Logout"
  */

  res.status(200).send({
    error: false,
    message: "User logout success You can delete token from your session.",
  });
};

type RefreshHandler = RequestHandler<{}, RefreshResponse, RefreshBody>;
const refresh: RefreshHandler = async (req, res) => {
  /*
      #swagger.tags = ['Authentication']
      #swagger.summary = 'JWT: Refresh'
      #swagger.description = 'Refresh accessToken with refreshToken'
      #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {
              refresh: '...refreshToken...'
          }
      }
  */

  const { refresh } = req.body;

  if (typeof refresh !== "string" || !refresh)
    throw new CustomError("Refresh Token not Fount.", 401);
  const refreshData = jwt.verify(refresh, env.REFRESH_KEY);
  if (!isRefreshData(refreshData)) throw new CustomError("JWT Refresh Token is wrong.");

  const user = await User.findById(refreshData._id);

  if (!user) throw new CustomError("User is not found with given ID.", 404);
  if (!user.isActive) throw new CustomError("This account is not active.", 401);

  res.status(200).send({
    error: false,
    access: createAccessToken(user),
  });
};

export default { login, register, logout, refresh };
