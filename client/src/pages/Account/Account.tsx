import { FC } from "react";
import { Button, Col, Row } from "reactstrap";
import { useProtectedRoute } from "../../utils/hooks";
import { useStoreActions } from "../../store";
import { useHistory } from "react-router-dom";

export const Account: FC = () => {
    const logOut = useStoreActions(actions => actions.logOut);
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
                        color="warning"
                        onClick={() => {
                            logOut();
                            history.push("/");
                        }}
                    >
                        Log out
                    </Button>
                </Col>
            </Row>
        </div>
    );
};
