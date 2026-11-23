/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
// sync():
import { mongoose } from "../configs/dbConnection";
import Car from "../models/car";
import Reservation from "../models/reservation";
import User from "../models/user";
import { cars, reservations, users } from "./dummyData";

export default async function sync(): Promise<void> {
  /* REMOVE DATABASE */
  await mongoose.connection.asPromise();
  await mongoose.connection.dropDatabase();
  console.log("- Database and all data DELETED!");

  // Dropping the database also drops the unique indexes.
  await User.syncIndexes();
  await Car.syncIndexes();

  /* ------------------------- */
  await User.insertMany(users);
  console.log("users added");

  /* ------------------------- */
  await Car.insertMany(cars);
  console.log("cars added");

  /* ------------------------- */
  await Reservation.insertMany(reservations);
  console.log("reservations added");
}
