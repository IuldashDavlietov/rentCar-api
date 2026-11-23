/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
import type { RequestHandler } from "express";
import type { QueryFilter } from "mongoose";
import type { ICar, CarBody, CarDocument } from "../models/car";
import type { DataListResponse, DataResponse, DeleteResponse, IdParams } from "../types/api";
import Car from "../models/car";
import car from "../models/car";

// Car Controller:

type ListHandler = RequestHandler<{}, DataListResponse<CarDocument>>;

const list: ListHandler = async (req, res) => {




    const data = await res.getModelList(Car, { isPublish: true });
    res.status(200).send({
        error: false,
        details: await res.getModelListDetails(Car),
        data
    })
};

type CreateHandler = RequestHandler<{}, DataResponse<CarDocument>, CarBody>;

const create: CreateHandler = async (req, res) => {
    const data = await Car.create(req.body)

    res.status(201).send({
        error: false,
        data,
    })
};

type ReadHandler = RequestHandler<IdParams, DataResponse<CarDocument | null>>;

const read: ReadHandler = async (req, res) => {
    const data = await Car.findById(req.params.id)
    res.status(200).send({
        error: false,
        data
    })
};

type UpdateHandler = RequestHandler<IdParams, DataResponse<CarDocument | null>, Partial<CarBody>>;

const update: UpdateHandler = async (req, res) => {
    const data = await car.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
        afterDocument: true
    })
};

type RemoveHandler = RequestHandler<IdParams, DeleteResponse>;

const remove: RemoveHandler = async (req, res) => {
    const data = await car.deleteOne({ _id: req.params.id })
    res.status(data.deletedCount ? 204 : 404).send({
        error: false,
        data
    })
};

export default { list, create, read, update, remove };
