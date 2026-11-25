import type { RequestHandler } from "express";
import type { QueryFilter } from "mongoose";
import type { ICar, CarBody, CarDocument } from "../models/car.model";
import type { DataListResponse, DataResponse, DeleteResponse, IdParams } from "../types/api";
import Car from "../models/car.model";
import Reservation from "../models/reservation.model";
import dateValidation from "../helpers/dateValidation";
import CustomError from "../helpers/customError";

type ListHandler = RequestHandler<{}, DataListResponse<CarDocument>>;
const list: ListHandler = async (req, res) => {
  const isStaffOrAdmin = Boolean(req.user?.isActive && (req.user.isAdmin || req.user.isStaff));
  const customFilter: QueryFilter<ICar> = isStaffOrAdmin ? {} : { isPublish: true };

  const { startDate: QStartDate, endDate: QEndDate } = req.query;
  if (typeof QStartDate === "string" && typeof QEndDate === "string") {
    const [start, end] = dateValidation(QStartDate, QEndDate);

    const reservedCarIds = await Reservation.find(
      {
        startDate: { $lte: end },
        endDate: { $gte: start },
      },
      { _id: 0, carId: 1 },
    ).distinct("carId");

    customFilter._id = { $nin: reservedCarIds };
  }

  const data = await res.getModelList(Car, customFilter);
  res.status(200).send({
    error: false,
    details: await res.getModelListDetails(Car, customFilter),
    data,
  });
};

type CreateHandler = RequestHandler<{}, DataResponse<CarDocument>, CarBody>;
const create: CreateHandler = async (req, res) => {
  const currentUserId = req.user?._id;
  req.body.creatorId = currentUserId;
  req.body.updatorId = currentUserId;

  const data = await Car.create(req.body);

  res.status(201).send({
    error: false,
    data,
  });
};

type ReadHandler = RequestHandler<IdParams, DataResponse<CarDocument | null>>;
const read: ReadHandler = async (req, res) => {
  const isStaffOrAdmin = Boolean(req.user?.isActive && (req.user.isAdmin || req.user.isStaff));

  const data = isStaffOrAdmin
    ? await Car.findById(req.params.id).populate([
        { path: "creatorId", select: "username" },
        { path: "updatorId", select: "username" },
      ])
    : await Car.findOne({ _id: req.params.id, isPublish: true });

  if (!data) {
    throw new CustomError("Car not found.", 404);
  }

  res.status(200).send({
    error: false,
    data,
  });
};

type UpdateHandler = RequestHandler<IdParams, DataResponse<CarDocument | null>, Partial<CarBody>>;
const update: UpdateHandler = async (req, res) => {
  const { creatorId: _ignored, ...updateData } = req.body;
  updateData.updatorId = req.user?._id;

  const data = await Car.findByIdAndUpdate(req.params.id, updateData, {
    runValidators: true,
    returnDocument: "after",
    context: "query",
  });

  if (!data) {
    throw new CustomError("Car not found.", 404);
  }

  res.status(202).send({
    error: false,
    data,
  });
};

type RemoveHandler = RequestHandler<IdParams, DeleteResponse>;
const remove: RemoveHandler = async (req, res) => {
  const data = await Car.deleteOne({ _id: req.params.id });
  res.status(data.deletedCount ? 204 : 404).send({
    error: !data.deletedCount,
    data,
  });
};

export default { list, create, read, update, remove };