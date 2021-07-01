import { FC, useEffect } from "react";
import { Col, Row } from "reactstrap";
import { LoginForm } from "../../components/Accounts/LoginForm";
import { useHistory } from "react-router-dom";
import { useStoreState } from "../../stores/_store";

export const Login: FC = () => {
    const history = useHistory();
    const currentUser = useStoreState(state => state.currentUser);

    useEffect(() => {
        if (currentUser) {
            history.replace("/");
        }
    }, [currentUser, history]);

    return (
        <div>
            <Row>
                <Col>
                    <h2>Log In</h2>
                </Col>
            </Row>
            <Row>
                <Col lg={6}>
                    <LoginForm afterSubmit={() => history.push("/")} />
                </Col>
            </Row>
        </div>
    );
};
