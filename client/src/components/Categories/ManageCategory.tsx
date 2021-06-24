import { FC } from "react";
import { CategoryRecord } from "../../../../shared/resource_models/category";
import { Button, Card } from "reactstrap";
import {
    ActionCardHeader,
    ActionsDropdown,
    KeyValCardBody,
} from "jack-hermanson-component-lib";
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
                <ActionsDropdown
                    options={[
                        {
                            type: "OnClickItem",
                            label: "Edit",
                            onClick: () => console.log("edit"),
                        },
                        undefined,
                        {
                            type: "OnClickItem",
                            label: "Delete",
                            onClick: () => console.log("delete"),
                        },
                    ]}
                />
            </ActionCardHeader>
            <KeyValCardBody keyValPairs={tableInfo} />
        </Card>
    );
};
