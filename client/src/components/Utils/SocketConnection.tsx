import { FC, Fragment, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useStoreActions } from "../../store";
import { SocketEvent } from "../../../../shared/enums";

export const SocketConnection: FC = () => {
    const loadCategories = useStoreActions(actions => actions.loadCategories);

    useEffect(() => {
        const socket: Socket = io("/");

        socket.on(SocketEvent.UPDATE_CATEGORY, e => {
            console.log(e);
            loadCategories();
        });
    }, [loadCategories]);

    return <Fragment />;
};
