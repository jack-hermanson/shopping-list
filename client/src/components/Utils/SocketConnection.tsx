import { FC, Fragment, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useStoreActions, useStoreState } from "../../store";
import { SocketEvent } from "../../../../shared/enums";

export const SocketConnection: FC = () => {
    const loadCategories = useStoreActions(actions => actions.loadCategories);
    const currentUser = useStoreState(state => state.currentUser);

    useEffect(() => {
        const socket: Socket = io("/");

        socket.on(SocketEvent.UPDATE_CATEGORY, e => {
            console.log(e);
            if (currentUser?.token) {
                loadCategories(currentUser.token);
            }
        });
    }, [loadCategories, currentUser?.token]);

    return <Fragment />;
};
