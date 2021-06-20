import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useStoreState } from "../store";

export const useProtectedRoute = (clearance?: number) => {
    const history = useHistory();
    const currentUser = useStoreState(state => state.currentUser);

    useEffect(() => {
        if (!currentUser) {
            history.replace("/login");
        }
    });
};
