import { FC } from "react";
import { Col, Container, Row } from "reactstrap";
import { CONTAINER_FLUID, APP_NAME } from "../../utils/constants";
import { getVersionNumber } from "../../utils/functions";
import { Link } from "react-router-dom";

export const Footer: FC = () => {
    return (
        <div className="footer-container bg-secondary">
            <Container className="pb-3 pt-2 mt-2" fluid={CONTAINER_FLUID}>
                <Row>
                    <Col className="text-muted d-flex">
                        <Link className="text-light me-3" to="/">
                            Home
                        </Link>
                        <Link className="text-light" to="/account">
                            Account
                        </Link>
                        <span className="ms-auto">{getVersionNumber()}</span>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
