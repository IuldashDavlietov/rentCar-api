import type { RequestHandler } from "express";
import type { QueryFilter } from "mongoose";
import type { ICar, CarBody, CarDocument } from "../models/car.model";
import type { DataListResponse, DataResponse, DeleteResponse, IdParams } from "../types/api";
import Car from "../models/car.model";
import Reservation from '../models/reservation.model'


// Car Controller:

type ListHandler = RequestHandler<{}, DataListResponse<CarDocument>>;

const list: ListHandler = async (req, res) => {
  // show only published cars to the customer
  let customFilter: QueryFilter<ICar> = { isPublish: true };

  if (req.user?.isAdmin || req.user?.isStaff) {
    customFilter = {};
  }

  const { startDate: QStartDate, endDate: QEndDate } = req.query
  if (typeof QStartDate === "string" && typeof QEndDate === "string") {

    // find not available cars
    const reservedCarIds = await Reservation.find({
      startDate: { $lte: new Date(QEndDate) },
      endDate: { $gte: new Date(QStartDate) },
    }, { _id: 0, carId: 1 }).distinct('carId');

    // remove those unavailable cars from car list
    customFilter._id = {$nin: reservedCarIds}
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
  const data = await Car.findById(req.params.id);
  res.status(200).send({
    error: false,
    data,
  });
};

type UpdateHandler = RequestHandler<IdParams, DataResponse<CarDocument | null>, Partial<CarBody>>;
const update: UpdateHandler = async (req, res) => {
  req.body.updatorId = req.user?._id;

  const data = await Car.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    returnDocument: "after",
  });

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
