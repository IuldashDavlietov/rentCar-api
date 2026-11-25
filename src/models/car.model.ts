import type { HydratedDocument, Types } from "mongoose";
import { mongoose } from "../configs/dbConnection";
import uniqueValidator from "mongoose-unique-validator";

// {
//     "plateNumber": "34ABC123",
//     "brand": "Ford",
//     "model": "Focus",
//     "year": 2020,
//     "isAutomatic": true,
//     "pricePerDay": 249.99
// }
// {
//     "plateNumber": "34ABC234",
//     "brand": "Renault",
//     "model": "Megane",
//     "year": 2022,
//     "isAutomatic": false,
//     "pricePerDay": 199.99
// }
// {
//     "plateNumber": "34ABC345",
//     "brand": "Opel",
//     "model": "Astra",
//     "year": 2021,
//     "isAutomatic": false,
//     "pricePerDay": 189.99,
//     "isPublish": false

// Car Model:

export interface ICar {
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  isAutomatic: boolean;
  pricePerDay: number;
  isPublish: boolean;
  images: string[];
  creatorId: Types.ObjectId;
  updatorId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// What the client sends. The controller adds creatorId and updatorId.
export type CarBody = Pick<ICar, "plateNumber" | "brand" | "model" | "year" | "pricePerDay"> &
  Partial<Pick<ICar, "isAutomatic" | "isPublish" | "images">> & {
    creatorId?: Types.ObjectId | string;
    updatorId?: Types.ObjectId | string;
  };

export type CarDocument = HydratedDocument<ICar>;

const CarSchema = new mongoose.Schema<ICar>(
  {
    plateNumber: {
      type: String,
      trim: true,
      unique: true,
      required: true
    },

    brand: {
      type: String,
      trim: true,
      required: true
    },

    model: {
      type: String,
      trim: true,
      required: true
    },

    pricePerDay: {
      type: Number,
      required: true
    },

    images: {
      type: [String],
      default: []

    },

    year: {
      type: Number,
      required: true,
      max: new Date().getFullYear()
    },

    isAutomatic: {
      type: Boolean,
      default: true,
    },

    isPublish: {
      type: Boolean,
      default: true
    },

    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    updatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    collection: "cars",
    timestamps: true,
  },
);

CarSchema.plugin(uniqueValidator, {
  message: "This {PATH} is exist",
});

export default mongoose.model<ICar>("Car", CarSchema);
