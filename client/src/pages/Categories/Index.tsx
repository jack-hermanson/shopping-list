import { FC } from "react";
import { PageHeader } from "jack-hermanson-component-lib/lib";
import { Col, Row } from "reactstrap";

export const Index: FC = () => {
    return (
        <div>
            <Row>
                <Col>
                    <PageHeader border={false} title="Manage Categories" />
                </Col>
            </Row>
        </div>
    );
};
