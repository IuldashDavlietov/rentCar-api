import { Router } from "express";
import permissions from "../middlewares/permissions.middleware";
import { validateId, validateBody } from "../middlewares/validate.middleware";
import user from "../controllers/user.controller";

const router = Router();
// URL: /users

router
  .route("/")
  .get(permissions.isStaffOrisAdmin, user.list)
  .post(permissions.isAdmin, validateBody, user.create);

router
  .route("/:id")
  .get(validateId, permissions.isLogin, permissions.isAdminOrOwner, user.read)
  .put(validateId, permissions.isAdmin, validateBody, user.update)
  .delete(validateId, permissions.isAdmin, user.remove);

export default router;