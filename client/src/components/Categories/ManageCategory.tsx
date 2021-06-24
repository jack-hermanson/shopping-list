import { FC } from "react";
import { CategoryRecord } from "../../../../shared/resource_models/category";
import { Button, Card, CardBody, CardHeader, Table } from "reactstrap";
import { ActionCardHeader, KeyValCardBody } from "jack-hermanson-component-lib";
import { KeyValPair } from "jack-hermanson-ts-utils";

interface Props {
    category: CategoryRecord;
}

export const ManageCategory: FC<Props> = ({ category }: Props) => {
    const tableInfo: KeyValPair[] = [
        {
            key: "Notes",
            val: category.notes ? (
                category.notes
            ) : (
                <span className="fst-italic text-muted">none</span>
            ),
        },
        { key: "Visible", val: category.visible.toString() },
    ];

    return (
        <Card className="mb-3 no-mb-last">
            <ActionCardHeader title={category.name}>
                <Button color="primary" size="sm">
                    Test
                </Button>
            </ActionCardHeader>
            <KeyValCardBody keyValPairs={tableInfo} />
        </Card>
    );
};
