import { Router } from "express";
import permissions from "../middlewares/permissions.middleware";
import { validateId, validateBody } from "../middlewares/validate.middleware";
import car from "../controllers/car.controller";

const router = Router();

// URL : /cars
router
  .route("/")
  .get(car.list)
  .post(permissions.isAdmin, validateBody, car.create);

router
  .route("/:id")
  .get(validateId, car.read)
  .put(validateId, permissions.isAdmin, validateBody, car.update)
  .delete(validateId, permissions.isAdmin, car.remove);

export default router;