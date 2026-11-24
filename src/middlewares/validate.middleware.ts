import { RequestHandler } from "express";
import mongoose from "mongoose";
import CustomError from "../helpers/customError";


export const validateId: RequestHandler = (req, res, next) => {
    const { id } = req.params
    if (!id || typeof id !== 'string' || !mongoose.isValidObjectId(id))
        throw new CustomError('Invalid ID', 400)
    next()
};

export const validateBody: RequestHandler = (req, res, next) => {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
        throw new CustomError("Request body must be a valid JSON object", 400);
    }
    next()
};
