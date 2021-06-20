import { FC } from "react";
import { Col, Row } from "reactstrap";
import { LoginForm } from "../../components/Login/LoginForm";
import { useHistory } from "react-router-dom";

export const Login: FC = () => {
    const history = useHistory();

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
