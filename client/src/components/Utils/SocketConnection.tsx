import { FC, Fragment, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useStoreActions, useStoreState } from "../../stores/_store";
import { SocketEvent } from "../../../../shared/enums";

export const SocketConnection: FC = () => {
    const loadCategories = useStoreActions(actions => actions.loadCategories);
    const loadCategory = useStoreActions(actions => actions.loadCategory);
    const loadItems = useStoreActions(actions => actions.loadItems);
    const loadItem = useStoreActions(actions => actions.loadItem);
    const loadAccounts = useStoreActions(actions => actions.loadAccounts);
    const loadChores = useStoreActions(actions => actions.loadChores);
    const loadChoreLogs = useStoreActions(actions => actions.loadChoreLogs);
    const currentUser = useStoreState(state => state.currentUser);

    useEffect(() => {
        console.log("socket");
        const socket: Socket = io("localhost:5000");
        console.log(socket);

        socket.on("connect", () => {
            console.log("socket connected on front end");
            if (currentUser?.token) {
                console.log("token available - fetching data");
                loadCategories(currentUser.token);
                loadItems(currentUser.token);
                loadAccounts(currentUser.token);
                loadChores(currentUser.token);
                loadChoreLogs(currentUser.token);
            }
        });

        socket.on("disconnect", message => {
            console.log("disconnected from socket");
            console.log(message);
        });

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

        socket.on(SocketEvent.UPDATE_ACCOUNTS, () => {
            if (currentUser?.token) {
                loadAccounts(currentUser.token);
            }
        });
    }, [
        loadCategories,
        loadCategory,
        loadItems,
        loadItem,
        loadAccounts,
        loadChores,
        loadChoreLogs,
        currentUser?.token,
    ]);

    return <Fragment />;
};
