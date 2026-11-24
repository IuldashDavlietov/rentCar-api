import type { HydratedDocument, Model, QueryFilter } from "mongoose";
import type { UserDocument } from "../models/user.model";
import type { AccessData, ListDetails, ModelPopulate } from "./api";

// Teach TypeScript about what our middlewares add to req and res.
declare global {
  namespace Express {
    interface Request {
      // Simple Token gives the user document, JWT gives the data inside the token.
      user?: UserDocument | AccessData | undefined;
      dateValidation?: { totalDays: number; start: Date; end: Date };
    }

    interface Response {
      errorStatusCode?: number;
      getModelList<T>(
        Model: Model<T>,
        customFilter?: QueryFilter<T>,
        populate?: ModelPopulate,
      ): Promise<HydratedDocument<T>[]>;
      getModelListDetails<T>(Model: Model<T>, customFilter?: QueryFilter<T>): Promise<ListDetails>;
    }
  }
}
