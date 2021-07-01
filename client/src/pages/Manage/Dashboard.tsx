import { FC } from "react";
import { ManageTabs } from "../../components/Manage/ManageTabs";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib/lib";
import { useProtectedRoute } from "../../utils/hooks";
import { Clearance } from "../../../../shared/enums";
import { useStoreState } from "../../stores/store";

export const Dashboard: FC = () => {
    useProtectedRoute(Clearance.ADMIN);

    const categories = useStoreState(state => state.categories);

    return (
        <div>
            <ManageTabs />
            <Row>
                <Col>
                    <PageHeader title="Dashboard" />
                </Col>
            </Row>
            <Row>
                <Col lg={4} className="mb-3 mb-lg-0">
                    {renderCategories()}
                </Col>
            </Row>
        </div>
    );

    function renderCategories() {
        return (
            <Card>
                <CardHeader>
                    <h5 className="mb-0">Categories</h5>
                </CardHeader>
                <CardBody>
                    <dl className="mb-0">
                        <dt>Visible</dt>
                        <dd>{categories?.filter(c => c.visible).length}</dd>

                        <dt>Hidden</dt>
                        <dd>{categories?.filter(c => !c.visible).length}</dd>
                    </dl>
                </CardBody>
            </Card>
        );
    }
};
