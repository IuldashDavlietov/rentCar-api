/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
// app.use(errorHandler):

import type { NextFunction, Request, Response } from "express";
import type { ErrorResponse } from "../types/api";

export default (
  err: unknown,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction,
): void => {
  const error = err instanceof Error ? err : new Error(String(err));

  // Controllers set res.errorStatusCode, CustomError and body-parser errors carry statusCode.
  const statusCode =
    res.errorStatusCode ??
    ("statusCode" in error && typeof error.statusCode === "number" ? error.statusCode : 500);

  res.status(statusCode).send({
    error: true,
    message: error.message,
    cause: error.cause,
    body: req.body ?? {},
  });
};
