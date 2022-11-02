import { FC } from "react";
import { Card, CardBody, Table } from "reactstrap";
import { ActionCardHeader } from "jack-hermanson-component-lib";
import { useStoreActions, useStoreState } from "../../stores/_store";
import { LoadingSpinner } from "jack-hermanson-component-lib/lib";
import { ListItem } from "../Items/ListItem";

export const UncheckedGroup: FC = () => {
    const uncheckedItems = useStoreState(state => state.uncheckedItems);
    const setShowUncheckedGroups = useStoreActions(
        actions => actions.setShowUncheckedGroup
    );

    return (
        <Card className="mb-3">
            <div
                className="hover-mouse"
                onClick={() => setShowUncheckedGroups(false)}
            >
                <ActionCardHeader title="Unchecked Items" />
            </div>
            <CardBody className="px-0 py-0">{renderItems()}</CardBody>
        </Card>
    );

    function renderItems() {
        if (uncheckedItems) {
            return (
                <Table className="card-table table-striped mb-0">
                    <tbody>
                        {uncheckedItems.map(item => (
                            <ListItem item={item} key={item.id} />
                        ))}
                    </tbody>
                </Table>
            );
        } else {
            return <LoadingSpinner />;
        }
    }
};
