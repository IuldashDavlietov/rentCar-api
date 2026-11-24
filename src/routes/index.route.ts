import { Router } from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import carRouter from "./car.route";
import reservationRouter from "./reservation.route";
import documentRouter from "./document.route";

const router = Router();
// ROUTER INDEX:
// URL: /

// auth:
router.use("/auth", authRouter);

// user:
router.use("/users", userRouter);

// car:
router.use("/cars", carRouter);

// reservation:
router.use("/reservations", reservationRouter);

// document:
router.use("/documents", documentRouter);

export default router;
