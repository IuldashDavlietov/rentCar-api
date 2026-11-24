/* -------------------------------------------------------
         EXPRESSJS - Query Handler Middleware
------------------------------------------------------- */

import type { RequestHandler } from "express";
import type { HydratedDocument, Model, QueryFilter, SortOrder } from "mongoose";
import type { ListDetails, ModelPopulate } from "../types/api";

type QueryObject = Record<string, unknown>;

const toQueryObject = (value: unknown): QueryObject =>
  typeof value === "object" && value !== null && !Array.isArray(value) ? { ...value } : {};

// Returns undefined when the value is not a number above zero.
const toPositiveInt = (value: unknown): number | undefined => {
  const number = parseInt(String(value));
  return number > 0 ? number : undefined;
};

// URL values are strings, mongoose wants a SortOrder.
const toSortOrder = (value: unknown): SortOrder | undefined => {
  switch (String(value).toLowerCase()) {
    case "asc":
    case "ascending":
    case "1":
      return 1;
    case "desc":
    case "descending":
    case "-1":
      return -1;
    default:
      return undefined;
  }
};

const queryHandler: RequestHandler = (req, res, next) => {
  /* FILTERING & SEARCHING & SORTING & PAGINATION */

  //* FILTERING
  // URL?filter[fieldName1]=value1&filter[fiedlName2]=value2
  const filter = toQueryObject(req.query.filter);

  //* SEARCHING
  // URL?search[fieldName1]=value1&search[fiedlName2]=value2
  const search = toQueryObject(req.query.search);

  for (const key in search) search[key] = { $regex: search[key], $options: "i" };

  //* SORTING
  // URL?sort[fieldName1]=value1&sort[fiedlName2]=value2
  const sort = toQueryObject(req.query.sort);

  const sortOptions: Record<string, SortOrder> = {};
  for (const key in sort) {
    const order = toSortOrder(sort[key]);
    if (order) sortOptions[key] = order;
  }

  //* PAGINATIONS:

  // PAGE
  // URL?page=2
  const page = toPositiveInt(req.query.page) ?? 1;

  // LIMIT
  // URL?limit=20
  const limit = toPositiveInt(req.query.limit) ?? 20;

  // SKIP
  // URL?skip=10
  const skip = toPositiveInt(req.query.skip) ?? (page - 1) * limit;

  // GetModelList
  res.getModelList = async <T>(
    Model: Model<T>,
    customFilter: QueryFilter<T> = {},
    populate?: ModelPopulate,
  ): Promise<HydratedDocument<T>[]> => {
    const conditions: QueryFilter<T> = { ...search, ...filter, ...customFilter };
    const query = Model.find(conditions).sort(sortOptions).skip(skip).limit(limit);

    return populate ? await query.populate([populate].flat()) : await query;
  };

  // GetModelListDetatils
  res.getModelListDetails = async <T>(
    Model: Model<T>,
    customFilter: QueryFilter<T> = {},
  ): Promise<ListDetails> => {
    const conditions: QueryFilter<T> = { ...search, ...filter, ...customFilter };
    const count = await Model.countDocuments(conditions);

    return {
      filter,
      search,
      sort,
      skip,
      limit,
      page,
      totalRecords: count,
      pages:
        count <= limit
          ? false
          : {
              previos: page > 1 ? page - 1 : false,
              current: page,
              next: page < Math.ceil(count / limit) ? page + 1 : false,
              total: Math.ceil(count / limit),
            },
    };
  };

  next();
};

export default queryHandler;
