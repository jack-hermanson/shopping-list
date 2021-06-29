import { FC } from "react";
import { Button, Col, Row } from "reactstrap";
import { useProtectedRoute } from "../../utils/hooks";
import { useStoreActions, useStoreState } from "../../store";
import { useHistory } from "react-router-dom";
import { getToken } from "../../utils/tokens";

export const Account: FC = () => {
    const logOut = useStoreActions(actions => actions.logOut);
    const currentUser = useStoreState(state => state.currentUser);
    const history = useHistory();

    useProtectedRoute();

    return (
        <div>
            <Row>
                <Col>
                    <h2>Account</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>Account page.</p>
                    <Button
                        color="secondary"
                        onClick={() => {
                            if (currentUser?.token) {
                                logOut(currentUser.token).then(() => {
                                    history.push("/login");
                                });
                            }
                        }}
                    >
                        Log out
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button
                        className="mt-3"
                        color="secondary"
                        onClick={async () => {
                            const token = getToken();
                            await navigator.clipboard.writeText(
                                token || "No token"
                            );
                        }}
                    >
                        Copy Token
                    </Button>
                </Col>
            </Row>
        </div>
    );
};
