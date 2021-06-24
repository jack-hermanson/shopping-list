import { FC } from "react";
import { PageHeader } from "jack-hermanson-component-lib/lib";
import { Button, Col, Row } from "reactstrap";
import { ManageTabs } from "../../components/Manage/ManageTabs";
import { useProtectedRoute } from "../../utils/hooks";
import { Clearance } from "../../../../shared/enums";
import { ManageCategories } from "../../components/Categories/ManageCategories";

export const Index: FC = () => {
    useProtectedRoute(Clearance.ADMIN);

    return (
        <div>
            <ManageTabs />
            <Row>
                <Col>
                    <PageHeader title="Manage Categories">
                        <Button size="sm" color="success">
                            New
                        </Button>
                    </PageHeader>
                </Col>
            </Row>
            <Row>
                <Col lg={6} className="mb-3 mb-lg-0">
                    <h4>Categories</h4>
                    <ManageCategories />
                </Col>
                <Col lg={6} className="sticky-top">
                    <h4>test</h4>
                </Col>
            </Row>
        </div>
    );
};
