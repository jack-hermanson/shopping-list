import { FC } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { useProtectedRoute } from "../../utils/hooks";
import { Clearance } from "../../../../shared/enums";
import { ListCategories } from "../../components/Categories/ListCategories";
import { CreateEditItemForm } from "../../components/Items/CreateEditItemForm";
import { useStoreActions, useStoreState } from "../../stores/_store";
import { errorAlert, scrollToTop } from "jack-hermanson-ts-utils";
import { MobileToggleCard } from "jack-hermanson-component-lib";

export const ListIndex: FC = () => {
    useProtectedRoute(Clearance.NORMAL);

    const saveItem = useStoreActions(actions => actions.saveItem);
    const addAlert = useStoreActions(actions => actions.addAlert);
    const currentUser = useStoreState(state => state.currentUser);
    const items = useStoreState(state => state.items);

    return (
        <div>
            <Row>
                <Col lg={8} className="mb-3 mb-lg-0">
                    <ListCategories />
                </Col>
                <Col lg={4}>
                    <div className="sticky-top">
                        {renderFiltering()}
                        {renderNewItem()}
                    </div>
                </Col>
            </Row>
        </div>
    );

    function renderNewItem() {
        return (
            <Card id="new-item-card">
                <CardHeader>
                    <h5 className="mb-0">New Item</h5>
                </CardHeader>
                <CardBody>
                    <CreateEditItemForm
                        onSubmit={async newItem => {
                            if (currentUser?.token) {
                                if (
                                    items?.some(
                                        i =>
                                            i.name.toLowerCase() ===
                                            newItem.name.toLowerCase()
                                    )
                                ) {
                                    addAlert(
                                        errorAlert(
                                            `An item with the name "${newItem.name}" already exists.`
                                        )
                                    );
                                    scrollToTop();
                                    return;
                                }
                                await saveItem({
                                    item: newItem,
                                    token: currentUser.token,
                                });
                            }
                        }}
                    />
                </CardBody>
            </Card>
        );
    }

    function renderFiltering() {
        return (
            <div className="mb-3" id="filtering">
                <MobileToggleCard cardTitle="Filtering">
                    <CardBody>
                        <p className="mb-0">Filter</p>
                    </CardBody>
                </MobileToggleCard>
            </div>
        );
    }
};
