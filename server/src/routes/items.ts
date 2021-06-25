import express, { Response } from "express";
import { auth } from "../middleware/auth";
import { Request } from "../utils/Request";
import { Clearance, SocketEvent } from "../../../shared/enums";
import { minClearance } from "../utils/clearance";
import {
    CreateEditItemRequest,
    ItemRecord,
} from "../../../shared/resource_models/item";
import { ItemService } from "../services/ItemService";
import { sendError } from "jack-hermanson-ts-utils/lib/functions/errors";
import { validateRequest } from "jack-hermanson-ts-utils/lib/functions/validation";
import { createEditItemSchema, Item } from "../models/Item";
import { Socket } from "socket.io";
import { HTTP } from "jack-hermanson-ts-utils";
import { CategoryItemService } from "../services/CategoryItemService";

export const router = express.Router();

router.post(
    "/",
    auth,
    async (req: Request<CreateEditItemRequest>, res: Response<ItemRecord>) => {
        if (!minClearance(req.account, Clearance.NORMAL, res)) return;

        try {
            if (!(await validateRequest(createEditItemSchema, req, res)))
                return;

            const requestBody: CreateEditItemRequest = req.body;
            const newItem = await ItemService.create(
                requestBody,
                req.account.id,
                res
            );
            if (!newItem) return;

            const categoryIds =
                await CategoryItemService.getCategoryIdsFromItem(newItem.id);

            // socket
            const socket: Socket = req.app.get("socketio");
            socket.emit(SocketEvent.UPDATE_ITEMS);

            res.status(HTTP.CREATED).json({ ...newItem, categoryIds });
        } catch (error) {
            sendError(error, res);
        }
    }
);

router.get(
    "/",
    auth,
    async (req: Request<any>, res: Response<ItemRecord[]>) => {
        if (!minClearance(req.account, Clearance.NORMAL, res)) return;

        const items: Item[] = await ItemService.getAll();
        const itemRecords: ItemRecord[] = [];

        for (let item of items) {
            const categoryIds =
                await CategoryItemService.getCategoryIdsFromItem(item.id);
            itemRecords.push({ ...item, categoryIds });
        }

        res.json(itemRecords);
    }
);
