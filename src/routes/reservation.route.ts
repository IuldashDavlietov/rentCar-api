import { Router } from "express";
import permissions from "../middlewares/permissions.middleware";
import { validateId, validateBody } from "../middlewares/validate.middleware";
import reservation from "../controllers/reservation.controller";

const router = Router();

// URL: /reservations
router
  .route("/")
  .get(permissions.isLogin, reservation.list)
  .post(permissions.isLogin, validateBody, reservation.create);

router
  .route("/:id")
  .get(validateId, permissions.isLogin, reservation.read)
  .put(validateId, permissions.isAdmin, validateBody, reservation.update)
  .delete(validateId, permissions.isAdmin, reservation.remove);

export default router;