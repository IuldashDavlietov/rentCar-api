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

const isAdminOrOwner: RequestHandler = (req, res, next) => {
  const isAdmin = Boolean(req.user?.isActive && req.user.isAdmin);
  const isOwner = Boolean(req.user?._id && String(req.user._id) === req.params.id);

  if (!isAdmin && !isOwner) {
    res.errorStatusCode = 403;
    throw new Error("AuthorizationError: You can only access your own profile.");
  }
  next();
};

const filterPublished: RequestHandler = (req, res, next) => {
  const isStaffOrAdmin = Boolean(req.user?.isActive && (req.user.isAdmin || req.user.isStaff));
  res.locals.customFilter = isStaffOrAdmin ? {} : { isPublish: true };
  next();
};

export default { isLogin, isStaffOrisAdmin, isAdmin, filterPublished, isAdminOrOwner };
