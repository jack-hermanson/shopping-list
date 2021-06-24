import { FC } from "react";
import { ManageTabs } from "../../components/Manage/ManageTabs";
import { Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib/lib";
import { useProtectedRoute } from "../../utils/hooks";
import { Clearance } from "../../../../shared/enums";

export const Dashboard: FC = () => {
    useProtectedRoute(Clearance.ADMIN);

    return (
        <div>
            <ManageTabs />
            <Row>
                <Col>
                    <PageHeader title="Dashboard" />
                </Col>
            </Row>
        </div>
    );
};
