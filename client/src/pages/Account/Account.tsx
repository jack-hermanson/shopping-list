import { FC, useEffect } from "react";
import { Col, Row } from "reactstrap";
import { useHistory } from "react-router-dom";

export const Account: FC = () => {
    const history = useHistory();

    useEffect(() => {
        history.replace("/login");
    });

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
