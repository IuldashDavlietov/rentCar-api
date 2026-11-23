import { Router } from "express";
import reservation from '../controllers/reservation'


const router = Router();

// URL : /reservation
router.route('/').get(reservation.list).post(reservation.create)
router.route('/:id').get(reservation.read).put(reservation.update).delete(reservation.remove);

export default router;
