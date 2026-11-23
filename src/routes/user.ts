import { Router } from "express";
import permissions from "../middlewares/permissions";
import user from "../controllers/user";

const router = Router();
// routes/user:
// URL: /users

router.route("/").get(permissions.isStaffOrisAdmin, user.list).post(user.create);

router
  .route("/:id")
  .get(permissions.isLogin, user.read)
  .put(permissions.isLogin, user.update)
  .patch(permissions.isLogin, user.update)
  .delete(permissions.isAdmin, user.remove);

export default router;
