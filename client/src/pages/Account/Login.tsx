import { FC } from "react";
import { Col, Row } from "reactstrap";
import { LoginForm } from "../../components/Login/LoginForm";

export const Login: FC = () => {
    return (
        <div>
            <Row>
                <Col>
                    <h2>Log In</h2>
                </Col>
            </Row>
            <Row>
                <Col lg={6}>
                    <LoginForm
                        afterSubmit={() => console.log("done submitting")}
                    />
                </Col>
            </Row>
        </div>
    );
};
