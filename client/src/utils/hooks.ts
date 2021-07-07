import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useStoreState } from "../stores/_store";
import { Clearance } from "../../../shared/enums";
import { setRedirectPath } from "./functions";

export const useProtectedRoute = (clearance?: Clearance) => {
    const history = useHistory();
    const currentUser = useStoreState(state => state.currentUser);

    useEffect(() => {
        if (!currentUser) {
            console.log(window.location.pathname);
            setRedirectPath(window.location.pathname);
            history.replace("/login");
        } else {
            if (clearance && currentUser.clearance < clearance) {
                history.replace("/forbidden");
            }
        }
    }, [currentUser, clearance, history]);
};
