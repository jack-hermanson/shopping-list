import { FC } from "react";
import { PageHeader } from "jack-hermanson-component-lib/lib";
import { Col, Row } from "reactstrap";
import { ManageTabs } from "../../components/Manage/ManageTabs";

export const Index: FC = () => {
    return (
        <div>
            <ManageTabs />
            <Row>
                <Col>
                    <PageHeader border={false} title="Manage Categories" />
                </Col>
            </Row>
        </div>
    );
};
