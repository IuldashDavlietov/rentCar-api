/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
// Middleware: permissions

import type { RequestHandler } from "express";

const isLogin: RequestHandler = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.errorStatusCode = 403;
    throw new Error("AuthenticationError: You must be logged in to access this resource.");
  }
};

const isStaffOrisAdmin: RequestHandler = (req, res, next) => {
  if (!(req.user?.isActive && (req.user.isAdmin || req.user.isStaff))) {
    res.errorStatusCode = 403;
    throw new Error("AuthorizationError: You must be an Admin or Staff to access this resource.");
  }
  next();
};

const isAdmin: RequestHandler = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.errorStatusCode = 403;
    throw new Error("AuthorizationError: You must be an Admin to access this resource.");
  }
};

export default { isLogin, isStaffOrisAdmin, isAdmin };
