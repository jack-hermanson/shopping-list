import { FC } from "react";
import { Col, Row } from "reactstrap";
import { HttpError } from "../../components/Utils/HttpError";
import { HTTP } from "jack-hermanson-ts-utils";

export const Forbidden: FC = () => {
    return (
        <Row>
            <Col>
                <HttpError status={HTTP.FORBIDDEN} />
            </Col>
        </Row>
    );
};
