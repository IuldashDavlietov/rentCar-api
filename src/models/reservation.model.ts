import type { HydratedDocument, Types } from "mongoose";
import { mongoose } from "../configs/dbConnection";


// {
//     "userId": "65343222b67e9681f937f001",
//     "carId": "65352f518a9ea121b1ca5001",
//     "startDate": "2023-10-10",
//     "endDate": "2023-10-16"
// }
// {
//     "userId": "65343222b67e9681f937f002",
//     "carId": "65352f518a9ea121b1ca5002",
//     "startDate": "2023-10-14",
//     "endDate": "2023-10-20"
// }


// Reservation Model:
export interface IReservation {
  userId: Types.ObjectId;
  carId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  amount: number;
  creatorId: Types.ObjectId;
  updatorId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// What the client sends. JSON has no Date, and the controller adds the other fields.
export interface ReservationBody {
  userId?: Types.ObjectId | string;
  carId: string;
  startDate: string;
  endDate: string;
  amount?: number;
  creatorId?: Types.ObjectId | string;
  updatorId?: Types.ObjectId | string;
}

export type ReservationDocument = HydratedDocument<IReservation>;

const ReservationSchema = new mongoose.Schema<IReservation>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      immutable: true
    },

    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
      immutable: true
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      immutable: true
    },

    updatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },{
    collection: "reservations",
    timestamps: true,
  },
);

export default mongoose.model<IReservation>("Reservation", ReservationSchema);
