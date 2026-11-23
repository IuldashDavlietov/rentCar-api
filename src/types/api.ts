// Shapes shared by controllers and middlewares.

import type { PopulateOptions, UpdateWriteOpResult, mongo } from "mongoose";

export type ModelPopulate = string | PopulateOptions | (string | PopulateOptions)[];

export interface IdParams {
  id: string;
}

export interface ListDetails {
  filter: object;
  search: object;
  sort: object;
  skip: number;
  limit: number;
  page: number;
  totalRecords: number;
  pages:
    | false
    | {
        previos: number | false;
        current: number;
        next: number | false;
        total: number;
      };
}

export interface DataResponse<T> {
  error: false;
  data: T;
}

export interface DataListResponse<T> extends DataResponse<T[]> {
  details: ListDetails;
}

export interface DataUpdateResponse<T> extends DataResponse<UpdateWriteOpResult> {
  new: T | null;
}

export interface DeleteResponse {
  error: boolean;
  data: mongo.DeleteResult;
}

// The data inside the access token.
export interface AccessData {
  _id: string;
  username: string;
  isActive: boolean;
  isAdmin: boolean;
  isStaff: boolean;
}

export interface LoginBody {
  username?: string;
  email?: string;
  password?: string;
}

export interface LoginResponse {
  error: false;
  bearer: { access: string; refresh: string };
}

export interface RefreshBody {
  refresh?: string;
}

export interface RefreshResponse {
  error: false;
  access: string;
}

export interface MessageResponse {
  error: false;
  message: string;
}

export interface ErrorResponse {
  error: true;
  message: string;
  cause: unknown;
  body: unknown;
}
