import { useEffect } from "react";
import { useHistory } from "react-router-dom";

export const useProtectedRoute = (clearance?: number) => {
    const history = useHistory();

    useEffect(() => {
        history.replace("/login");
    });
};
