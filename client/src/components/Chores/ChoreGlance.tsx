import { FunctionComponent } from "react";
import { ChoreRecord } from "../../../../shared/resource_models/chore";
import { Card, CardBody } from "reactstrap";

interface Props {
    chore: ChoreRecord;
}

export const ChoreGlance: FunctionComponent<Props> = ({ chore }) => {
    return (
        <Card className="mb-3 no-mb-last">
            <CardBody>
                <p>
                    {chore.id}, {chore.title}, {chore.description},{" "}
                    {chore.intervalDays}, {chore.recurring.toString()}
                </p>
            </CardBody>
        </Card>
    );
};
