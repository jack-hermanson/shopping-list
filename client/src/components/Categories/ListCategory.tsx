import { FC } from "react";
import { Button, Card, CardBody, CardHeader } from "reactstrap";
import { CategoryRecord } from "../../../../shared/resource_models/category";

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
            <CardBody>
                <p>
                    {category.id} visible: {category.visible.toString()}
                </p>
                <p>{category.notes}</p>
            </CardBody>
        </Card>
    );

    function toggleVisibility() {
        console.log("visibility toggled");
    }
};
