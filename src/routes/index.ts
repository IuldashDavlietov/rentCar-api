import { Router } from "express";
import authRouter from "./auth";
import userRouter from "./user";
import carRouter from "./car";
import reservationRouter from "./reservation";
import documentRouter from "./document";

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
