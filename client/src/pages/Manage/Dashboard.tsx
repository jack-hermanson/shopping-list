import { FC } from "react";
import { ManageTabs } from "../../components/Manage/ManageTabs";
import { Col, Row } from "reactstrap";

export const Dashboard: FC = () => {
    return (
        <div>
            <ManageTabs />
            <Row>
                <Col>
                    <p>Manage dashboard</p>
                </Col>
            </Row>
        </div>
    );
};
