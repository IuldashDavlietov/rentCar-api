import type { RequestHandler } from "express";
import type { QueryFilter } from "mongoose";
import type { IReservation, ReservationBody, ReservationDocument } from "../models/reservation.model";
import type { DataListResponse, DataResponse, DeleteResponse, IdParams } from "../types/api";
import Reservation from "../models/reservation.model";
import Car from "../models/car.model";
import dateValidation from "../helpers/dateValidation";
import CustomError from "../helpers/customError";

// Reservation Controller:

type ListHandler = RequestHandler<{}, DataListResponse<ReservationDocument>>;
const list: ListHandler = async (req, res) => {
  // If user is not admin or staff, show only reservations belonging to current user
  const isAdminOrStaff = Boolean(req.user?.isActive && (req.user.isAdmin || req.user.isStaff));
  const customFilter: QueryFilter<IReservation> = isAdminOrStaff ? {} : { userId: req.user?._id };

  const data = await res.getModelList(Reservation, customFilter, [
    { path: "userId", select: "username firstName lastName" },
    { path: "carId", select: "brand model" },
    { path: "creatorId", select: "username" },
    { path: "updatorId", select: "username" },
  ]);

  res.status(200).send({
    error: false,
    details: await res.getModelListDetails(Reservation, customFilter),
    data,
  });
};

type CreateHandler = RequestHandler<{}, DataResponse<ReservationDocument>, ReservationBody>;
const create: CreateHandler = async (req, res) => {
  const isAdminOrStaff = Boolean(req.user?.isActive && (req.user.isAdmin || req.user.isStaff));
  const currentUserId = req.user?._id; // logged in user

  let userId = req.body.userId;
  if (!isAdminOrStaff) {
    req.body.userId = currentUserId;
    userId = currentUserId;
  }

  req.body.creatorId = currentUserId;
  req.body.updatorId = currentUserId;

  // Validate requested dates
  const { startDate: QStartDate, endDate: QEndDate, carId } = req.body;
  const [startDate, endDate, reservedDays] = dateValidation(QStartDate, QEndDate);

  // Check if the car is already reserved OR user already has a reservation in these days
  const isCarReserverd = await Reservation.find({
    startDate: { $lte: endDate },
    endDate: { $gte: startDate },
    $or: [{ carId }, { userId }],
  });

  if (isCarReserverd.length > 0) {
    throw new CustomError("The car is already reserved or you already have a reservation for given dates.", 409);
  }

  // Customers can only reserve published cars
  const carFilter = isAdminOrStaff ? { _id: carId } : { _id: carId, isPublish: true };
  const car = await Car.findOne(carFilter, { _id: 0, pricePerDay: 1 }).lean();

  if (!car) throw new CustomError("Car is not Found", 404);

  req.body.amount = car.pricePerDay * reservedDays;

  const data = await Reservation.create(req.body);
  res.status(201).send({
    error: false,
    data,
  });
};

type ReadHandler = RequestHandler<IdParams, DataResponse<ReservationDocument | null>>;
const read: ReadHandler = async (req, res) => {
  // Customers can only read their own reservations; admin/staff can read any
  const isAdminOrStaff = Boolean(req.user?.isActive && (req.user.isAdmin || req.user.isStaff));
  const customFilter: QueryFilter<IReservation> = isAdminOrStaff
    ? { _id: req.params.id }
    : { _id: req.params.id, userId: req.user?._id };

  const data = await Reservation.findOne(customFilter).populate([
    { path: "userId", select: "username firstName lastName" },
    { path: "carId", select: "brand model" },
    { path: "creatorId", select: "username" },
    { path: "updatorId", select: "username" },
  ]);

  if (!data) throw new CustomError("Reservation is not Found", 404);

  res.status(200).send({
    error: false,
    data,
  });
};

type UpdateHandler = RequestHandler<IdParams,DataResponse<ReservationDocument | null>,Partial<ReservationBody>>;
const update: UpdateHandler = async (req, res) => {
  const existing = await Reservation.findById(req.params.id);
  if (!existing) throw new CustomError("Reservation is not Found", 404);

  const userId = req.body.userId ?? existing.userId;
  const carId = req.body.carId ?? existing.carId;
  const QStartDate = req.body.startDate ?? existing.startDate.toISOString();
  const QEndDate = req.body.endDate ?? existing.endDate.toISOString();

  const [startDate, endDate, reservedDays] = dateValidation(QStartDate, QEndDate);

  // Exclude current reservation (_id: $ne) from overlap check
  const isCarReserverd = await Reservation.find({
    _id: { $ne: req.params.id },
    startDate: { $lte: endDate },
    endDate: { $gte: startDate },
    $or: [{ carId }, { userId }],
  });

  if (isCarReserverd.length > 0) {
    throw new CustomError("The car is already reserved or user already has a reservation for given dates.", 409);
  }

  const car = await Car.findById(carId, { _id: 0, pricePerDay: 1 }).lean();
  if (!car) throw new CustomError("Car is not Found", 404);

  req.body.amount = car.pricePerDay * reservedDays;
  req.body.updatorId = req.user?._id;
  delete req.body.creatorId;

  const data = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    returnDocument: "after",
    context: "query",
  });

  res.status(202).send({
    error: false,
    data,
  });
};

type RemoveHandler = RequestHandler<IdParams, DeleteResponse>;
const remove: RemoveHandler = async (req, res) => {
  const data = await Reservation.deleteOne({ _id: req.params.id });
  res.status(data.deletedCount ? 204 : 404).send({
    error: !data.deletedCount,
    data,
  });
};

export default { list, create, read, update, remove };