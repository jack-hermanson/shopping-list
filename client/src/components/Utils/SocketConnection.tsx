import { FC, Fragment, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useStoreActions, useStoreState } from "../../stores/store";
import { SocketEvent } from "../../../../shared/enums";

export const SocketConnection: FC = () => {
    const loadCategories = useStoreActions(actions => actions.loadCategories);
    const loadCategory = useStoreActions(actions => actions.loadCategory);
    const loadItems = useStoreActions(actions => actions.loadItems);
    const loadItem = useStoreActions(actions => actions.loadItem);
    const currentUser = useStoreState(state => state.currentUser);

    useEffect(() => {
        const socket: Socket = io("/");

        socket.on(SocketEvent.UPDATE_CATEGORY, e => {
            if (currentUser?.token) {
                loadCategory({
                    token: currentUser.token,
                    id: e.id,
                });
                console.log("Reloaded one category");
            }
        });

        socket.on(SocketEvent.UPDATE_CATEGORIES, () => {
            if (currentUser?.token) {
                loadCategories(currentUser.token);
                console.log("Reloaded all categories.");
            }
        });

        socket.on(SocketEvent.UPDATE_ITEMS, () => {
            if (currentUser?.token) {
                loadItems(currentUser.token);
            }
        });

        socket.on(SocketEvent.UPDATE_ITEM, e => {
            if (currentUser?.token) {
                loadItem({ token: currentUser.token, id: e.id });
            }
        });
    }, [loadCategories, loadCategory, loadItems, loadItem, currentUser?.token]);

    return <Fragment />;
};
