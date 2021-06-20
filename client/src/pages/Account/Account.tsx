import { FC, useEffect } from "react";
import { Col, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import { useProtectedRoute } from "../../utils/hooks";

export const Account: FC = () => {
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
                </Col>
            </Row>
        </div>
    );
};
