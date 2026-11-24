import type { RequestHandler } from "express";
import type { IUser, UserBody, UserDocument } from "../models/user.model";
import type { DataListResponse, DataResponse, DeleteResponse, IdParams } from "../types/api";
import User from "../models/user.model";
import passwordValidation from "../helpers/passwordValidation";

// User Controller:

type ListHandler = RequestHandler<{}, DataListResponse<UserDocument>>;
const list: ListHandler = async (req, res) => {
  /*
      #swagger.tags = ["Users"]
      #swagger.summary = "List Users"
      #swagger.description = `
        You can send query with endpoint for search[], sort[], page and limit.
        <ul> Examples:
            <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
            <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
            <li>URL/?<b>page=2&limit=1</b></li>
        </ul>
      `
    */

  const data = await res.getModelList<IUser>(User);
  res.status(200).send({
    error: false,
    details: await res.getModelListDetails<IUser>(User),
    data,
  });
};

type ReadHandler = RequestHandler<IdParams, DataResponse<UserDocument | null>>;
const read: ReadHandler = async (req, res) => {
  /*
      #swagger.tags = ["Users"]
      #swagger.summary = "Get Single User"
    */

  const data = await User.findOne({ _id: req.params.id });
  res.status(200).send({
    error: false,
    data,
  });
};

type CreateHandler = RequestHandler<{}, DataResponse<UserDocument>, UserBody>;
const create: CreateHandler = async (req, res) => {
  /*
    #swagger.tags = ["Users"]
    #swagger.summary = "Create User"
  */

  passwordValidation(req.body.password);
  const data = await User.create(req.body);

  res.status(201).send({
    error: false,
    data,
  });
};

type UpdateHandler = RequestHandler<IdParams, DataResponse<UserDocument | null>, Partial<UserBody>>;
const update: UpdateHandler = async (req, res) => {
  /*
      #swagger.tags = ["Users"]
      #swagger.summary = "Update User"
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

  const allowedKeys: (keyof UserBody)[] =
    req.user?.isActive && req.user.isAdmin
      ? ["username", "email", "password", "isActive", "isStaff", "isAdmin"]
      : ["username", "email", "password"];

  const isAllowed = Object.keys(req.body).every((key) =>
    allowedKeys.includes(key as keyof UserBody),
  );

  if (!isAllowed) {
    res.errorStatusCode = 403;
    throw new Error("AuthorizationError: You do not have permission to update these fields.");
  }

  if (req.body.password !== undefined) {
    passwordValidation(req.body.password);
  }

  const data = await User.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
    context: "query",
  });

  res.status(202).send({
    error: false,
    data,
  });
};

type RemoveHandler = RequestHandler<IdParams, DeleteResponse>;
const remove: RemoveHandler = async (req, res) => {
  /*
        #swagger.tags = ["Users"]
        #swagger.summary = "Delete User"
    */

  const data = await User.deleteOne({ _id: req.params.id });

  res.status(data.deletedCount ? 204 : 404).send({
    error: !data.deletedCount,
    data,
  });
};



export default { list, create, read, update, remove };
