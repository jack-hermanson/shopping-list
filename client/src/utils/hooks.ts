import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useStoreState } from "../store";
import { Clearance } from "../../../shared/enums";

export const useProtectedRoute = (clearance?: Clearance) => {
    const history = useHistory();
    const currentUser = useStoreState(state => state.currentUser);

    useEffect(() => {
        if (!currentUser) {
            history.replace("/login");
        } else {
            if (clearance && currentUser.clearance < clearance) {
                history.replace("/forbidden");
            }
        }
    });
};
