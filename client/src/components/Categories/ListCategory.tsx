import { FC } from "react";
import { Button, Card, CardBody, CardHeader, Collapse } from "reactstrap";
import { CategoryRecord } from "../../../../shared/resource_models/category";
import { useStoreActions, useStoreState } from "../../store";
import { scrollToTop } from "jack-hermanson-ts-utils";

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

    return (
        <Card className="mb-3">
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
            <Collapse isOpen={category.visible}>
                <CardBody>
                    <p>
                        {category.id} visible: {category.visible.toString()}
                    </p>
                    <p>{category.notes}</p>
                </CardBody>
            </Collapse>
        </Card>
    );

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
