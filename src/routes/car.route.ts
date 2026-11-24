import { Router } from "express";
import car from '../controllers/car.controller'


const router = Router();

// URL : /cars
router.route('/').get(car.list).post(car.create)
router.route('/:id').get(car.read).put(car.update).delete(car.remove);

export default router;
