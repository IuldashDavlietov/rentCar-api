import type { RequestHandler } from "express";
import type { QueryFilter } from "mongoose";
import type { IReservation, ReservationBody, ReservationDocument } from "../models/reservation";
import type { DataListResponse, DataResponse, DeleteResponse, IdParams } from "../types/api";
import Reservation from "../models/reservation";

// Reservation Controller:

type ListHandler = RequestHandler<{}, DataListResponse<ReservationDocument>>;

const list: ListHandler = async (req, res) => {
    const data = await res.getModelList(Reservation);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Reservation),
      data,
    });
};

type CreateHandler = RequestHandler<{}, DataResponse<ReservationDocument>, ReservationBody>;

const create: CreateHandler = async (req, res) => {
    const data = await Reservation.create(req.body);
    res.status(201).send({
      error: false,
      data,
    });
};

type ReadHandler = RequestHandler<IdParams, DataResponse<ReservationDocument | null>>;

const read: ReadHandler = async (req, res) => {
    const data = await Reservation.findById(req.params.id);
    res.status(200).send({
      error: false,
      data,
    });
};

type UpdateHandler = RequestHandler<
  IdParams,
  DataResponse<ReservationDocument | null>,
  Partial<ReservationBody>
>;

const update: UpdateHandler = async (req, res) => {
    const data = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      afterDocument: true,
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
      error: true,
      data,
    });
};

export default { list, create, read, update, remove };