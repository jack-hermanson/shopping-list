import { FC } from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
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
            <CardHeader>
                <h5 className="card-title mb-0">{category.name}</h5>
            </CardHeader>
            <CardBody>
                <p>
                    {category.id} visible: {category.visible.toString()}
                </p>
                <p>{category.notes}</p>
            </CardBody>
        </Card>
    );
};
