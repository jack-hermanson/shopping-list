import express, { Response } from "express";
import { auth } from "../middleware/auth";
import { Request } from "../utils/Request";
import { Clearance, SocketEvent } from "../../../shared/enums";
import { minClearance } from "../utils/clearance";
import {
    CreateEditItemRequest,
    ItemRecord,
    ToggleAllItemsRequest,
} from "../../../shared/resource_models/item";
import { ItemService } from "../services/ItemService";
import { HTTP, sendError, validateRequest } from "jack-hermanson-ts-utils";
import {
    createEditItemSchema,
    Item,
    toggleAllItemsSchema,
} from "../models/Item";
import { Socket } from "socket.io";
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

router.get(
    "/:id",
    auth,
    async (req: Request<{ id: number }>, res: Response<ItemRecord>) => {
        if (!minClearance(req.account, Clearance.NORMAL, res)) return;
        const item = await ItemService.getOne(req.params.id, res);
        const categoryIds = await CategoryItemService.getCategoryIdsFromItem(
            item.id
        );
        res.json({ ...item, categoryIds });
    }
);

router.put(
    "/toggle-all",
    auth,
    async (req: Request<ToggleAllItemsRequest>, res: Response<boolean>) => {
        if (!minClearance(req.account, Clearance.NORMAL, res)) {
            return;
        }

        if (!(await validateRequest(toggleAllItemsSchema, req, res))) {
            return;
        }

        const requestBody: ToggleAllItemsRequest = req.body;

        const toggled = await ItemService.toggleAll(
            requestBody,
            req.account.id,
            res
        );

        if (!toggled) {
            return;
        }

        const socket: Socket = req.app.get("socketio");
        socket.emit(SocketEvent.UPDATE_ITEMS);

        res.json(true);
    }
);

router.put(
    "/check/:id",
    auth,
    async (
        req: Request<{ id: number; checked: boolean }>,
        res: Response<Item>
    ) => {
        if (!minClearance(req.account, Clearance.NORMAL, res)) return;
        const checked = req.body.checked;
        const id = req.params.id;
        const modifiedItem = await ItemService.toggleChecked(
            id,
            checked,
            req.account.id,
            res
        );
        if (!modifiedItem) return;

        const socket: Socket = req.app.get("socketio");
        socket.emit(SocketEvent.UPDATE_ITEM, { id });

        res.json(modifiedItem);
    }
);

router.put(
    "/:id",
    auth,
    async (
        req: Request<{ id: number; CreateEditItemRequest }>,
        res: Response<ItemRecord>
    ) => {
        if (!minClearance(req.account, Clearance.NORMAL, res)) return;

        try {
            if (!(await validateRequest(createEditItemSchema, req, res)))
                return;

            const id = req.params.id;
            const requestBody: CreateEditItemRequest = req.body;
            const editedItem = await ItemService.update(
                id,
                requestBody,
                req.account.id,
                res
            );
            if (!editedItem) return;

            const categoryIds =
                await CategoryItemService.getCategoryIdsFromItem(id);

            // socket
            const socket: Socket = req.app.get("socketio");
            socket.emit(SocketEvent.UPDATE_ITEM, { id });

            res.json({ ...editedItem, categoryIds });
        } catch (error) {
            sendError(error, res);
        }
    }
);

router.delete(
    "/:id",
    auth,
    async (req: Request<{ id: number }>, res: Response<boolean>) => {
        if (!minClearance(req.account, Clearance.ADMIN, res)) return;
        try {
            const deleted = await ItemService.delete(req.params.id, res);
            if (!deleted) return;

            const socket: Socket = req.app.get("socketio");
            socket.emit(SocketEvent.UPDATE_ITEMS);

            res.json(true);
        } catch (error) {
            sendError(error, res);
        }
    }
);
