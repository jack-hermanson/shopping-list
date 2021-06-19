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
                    <Col lg={6} className="text-muted">
                        <Link className="text-light me-3" to="/">
                            Home
                        </Link>
                        <Link className="text-light" to="/account">
                            Account
                        </Link>
                    </Col>
                    <Col lg={6} className="text-muted d-flex">
                        <span className="ms-lg-auto">
                            {APP_NAME} v{getVersionNumber()}&nbsp;[
                            {process.env.NODE_ENV}]
                        </span>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
