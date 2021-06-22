import { FC, Fragment, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useStoreActions, useStoreState } from "../../store";
import { SocketEvent } from "../../../../shared/enums";

export const SocketConnection: FC = () => {
    const loadCategories = useStoreActions(actions => actions.loadCategories);
    const loadCategory = useStoreActions(actions => actions.loadCategory);
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
    }, [loadCategories, loadCategory, currentUser?.token]);

    return <Fragment />;
};
