import { FC } from "react";
import { ManageTabs } from "../../components/Manage/ManageTabs";
import { Card, CardHeader, Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib/lib";
import { useProtectedRoute } from "../../utils/hooks";
import { Clearance } from "../../../../shared/enums";
import { useStoreState } from "../../stores/_store";
import { KeyValCardBody } from "jack-hermanson-component-lib";
import { KeyValPair } from "jack-hermanson-ts-utils";

export const Dashboard: FC = () => {
    useProtectedRoute(Clearance.ADMIN);

    const categories = useStoreState(state => state.categories);
    const items = useStoreState(state => state.items);

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
        const categoryData: KeyValPair[] = [];
        if (categories && items) {
            categories.forEach(category => {
                const itemsInCategory = items.filter(i =>
                    i.categoryIds.includes(category.id)
                ).length;
                categoryData.push({
                    key: category.name,
                    val: `${itemsInCategory} ${"item".pluralize(
                        itemsInCategory
                    )}`,
                });
            });
        }
        return (
            <Card>
                <CardHeader>
                    <h5 className="mb-0">Categories</h5>
                </CardHeader>
                <KeyValCardBody keyValPairs={categoryData} />
            </Card>
        );
    }
};
