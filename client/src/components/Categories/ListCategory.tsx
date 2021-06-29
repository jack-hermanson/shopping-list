import { FC } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Collapse,
    Table,
} from "reactstrap";
import { CategoryRecord } from "../../../../shared/resource_models/category";
import { useStoreActions, useStoreState } from "../../store";
import { scrollToTop } from "jack-hermanson-ts-utils";
import { LoadingSpinner } from "jack-hermanson-component-lib/lib";
import { ListItem } from "../Items/ListItem";

interface Props {
    category: CategoryRecord;
}

/*
This component will show up on the actual list.
It renders individual Item records.
It should not be used for displaying information
about a Category record itself.
 */
export const ListCategory: FC<Props> = ({ category }: Props) => {
    const updateCategory = useStoreActions(actions => actions.updateCategory);
    const currentUser = useStoreState(state => state.currentUser);
    const items = useStoreState(state => state.items)?.filter(i =>
        i.categoryIds.includes(category.id)
    );

    return (
        <Card className="mb-3 no-mb-last">
            {renderCardHeader()}
            <Collapse isOpen={category.visible}>
                <CardBody className="px-0 py-0">
                    {items ? (
                        <Table className="card-table table-striped mb-0">
                            <tbody>
                                {items.map(item => (
                                    <ListItem
                                        categoryId={category.id}
                                        item={item}
                                        key={item.id}
                                    />
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <LoadingSpinner />
                    )}
                </CardBody>
            </Collapse>
        </Card>
    );

    function renderCardHeader() {
        return (
            <CardHeader className="d-flex">
                <div
                    className="d-flex hover-mouse w-100"
                    onClick={toggleVisibility}
                >
                    <h5 className="card-title my-auto">{category.name}</h5>
                </div>
                <div className="ms-auto">
                    <Button color="secondary" size="sm">
                        Actions
                    </Button>
                </div>
            </CardHeader>
        );
    }

    async function toggleVisibility() {
        if (currentUser?.token) {
            try {
                await updateCategory({
                    id: category.id,
                    editedCategory: {
                        ...category,
                        visible: !category.visible,
                    },
                    token: currentUser.token,
                });
            } catch (error) {
                console.error(error);
                scrollToTop();
            }
        }
    }
};
