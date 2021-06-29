import { FC } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { useProtectedRoute } from "../../utils/hooks";
import { Clearance } from "../../../../shared/enums";
import { ListCategories } from "../../components/Categories/ListCategories";
import { CreateEditItemForm } from "../../components/Items/CreateEditItemForm";
import { useStoreActions, useStoreState } from "../../store";

export const ListIndex: FC = () => {
    useProtectedRoute(Clearance.NORMAL);

    const saveItem = useStoreActions(actions => actions.saveItem);
    const currentUser = useStoreState(state => state.currentUser);

    return (
        <div>
            <Row>
                <Col lg={8} className="mb-3 mb-lg-0">
                    <ListCategories />
                </Col>
                <Col lg={4}>
                    <Card id="new-item-card">
                        <CardHeader>
                            <h5 className="mb-0">New Item</h5>
                        </CardHeader>
                        <CardBody>
                            <CreateEditItemForm
                                onSubmit={async newItem => {
                                    if (currentUser?.token) {
                                        await saveItem({
                                            item: newItem,
                                            token: currentUser.token,
                                        });
                                    }
                                }}
                            />
                        </CardBody>
                    </Card>
                    <p>Filtering</p>
                </Col>
            </Row>
        </div>
    );
};
