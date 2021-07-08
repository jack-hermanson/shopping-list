import express, { Response } from "express";
import { auth } from "../middleware/auth";
import { Request } from "../utils/Request";
import { Clearance, SocketEvent } from "../../../shared/enums";
import {
    CategoryRecord,
    CreateEditCategoryRequest,
} from "../../../shared/resource_models/category";
import { CategoryService } from "../services/CategoryService";
import { minClearance } from "../utils/clearance";
import { HTTP, sendError, validateRequest } from "jack-hermanson-ts-utils";
import { createEditCategorySchema } from "../models/Category";
import { Socket } from "socket.io";

export const router = express.Router();

router.get(
    "/",
    auth,
    async (req: Request<any>, res: Response<CategoryRecord[]>) => {
        if (!minClearance(req.account, Clearance.NORMAL, res)) return;

        const categories = await CategoryService.getAll();
        res.json(categories);
    }
);

router.post(
    "/",
    auth,
    async (
        req: Request<CreateEditCategoryRequest>,
        res: Response<CategoryRecord>
    ) => {
        if (!minClearance(req.account, Clearance.ADMIN, res)) return;

        try {
            if (!(await validateRequest(createEditCategorySchema, req, res)))
                return;

            const requestBody: CreateEditCategoryRequest = req.body;
            const newCategory = await CategoryService.create(requestBody, res);
            if (!newCategory) return;

            // socket
            const socket: Socket = req.app.get("socketio");
            socket.emit(SocketEvent.UPDATE_CATEGORIES);

            res.status(HTTP.CREATED).json(newCategory);
        } catch (error) {
            sendError(error, res);
        }
    }
);

router.put(
    "/:id",
    auth,
    async (
        req: Request<{ id: number; CreateEditCategoryRequest }>,
        res: Response<CategoryRecord>
    ) => {
        if (!minClearance(req.account, Clearance.ADMIN, res)) return;
        try {
            if (!(await validateRequest(createEditCategorySchema, req, res)))
                return;

            const requestBody: CreateEditCategoryRequest = req.body;
            const editedCategory = await CategoryService.update(
                req.params.id,
                requestBody,
                res
            );

            if (!editedCategory) return;

            // socket
            const socket: Socket = req.app.get("socketio");
            socket.emit(SocketEvent.UPDATE_CATEGORY, { id: editedCategory.id });

            res.json(editedCategory);
        } catch (error) {
            sendError(error, res);
        }
    }
);

router.get(
    "/:id",
    auth,
    async (req: Request<{ id: number }>, res: Response<CategoryRecord>) => {
        if (!minClearance(req.account, Clearance.NORMAL, res)) return;

        try {
            const category = await CategoryService.getOne(req.params.id, res);
            if (!category) return;

            res.json(category);
        } catch (error) {
            sendError(error, res);
        }
    }
);

router.delete(
    "/:id",
    auth,
    async (req: Request<{ id: number }>, res: Response) => {
        if (!minClearance(req.account, Clearance.ADMIN, res)) return;

        try {
            const socket: Socket = req.app.get("socketio");

            const deleted = await CategoryService.deleteOne(req.params.id, res);
            if (!deleted) return;

            socket.emit(SocketEvent.UPDATE_CATEGORIES);
            res.sendStatus(HTTP.OK);
        } catch (error) {
            sendError(error, res);
        }
    }
);
