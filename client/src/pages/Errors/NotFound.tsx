import { FC } from "react";
import { Col, Row } from "reactstrap";
import { HttpError } from "../../components/Utils/HttpError";
import { HTTP } from "jack-hermanson-ts-utils";

export const NotFound: FC = () => {
    return (
        <Row>
            <Col>
                <HttpError status={HTTP.NOT_FOUND} />
            </Col>
        </Row>
    );
};
