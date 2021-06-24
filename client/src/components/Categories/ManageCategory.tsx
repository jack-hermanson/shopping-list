import { FC } from "react";
import { CategoryRecord } from "../../../../shared/resource_models/category";
import { Card } from "reactstrap";
import {
    ActionCardHeader,
    ActionsDropdown,
    KeyValCardBody,
} from "jack-hermanson-component-lib";
import { KeyValPair } from "jack-hermanson-ts-utils";

interface Props {
    category: CategoryRecord;
    edit: (category: CategoryRecord) => any;
    deleteCategory: (categoryId: number) => any;
}

export const ManageCategory: FC<Props> = ({
    category,
    edit,
    deleteCategory,
}: Props) => {
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
                            onClick: () => edit(category),
                        },
                        undefined,
                        {
                            type: "OnClickItem",
                            label: "Delete",
                            onClick: () => deleteCategory(category.id),
                        },
                    ]}
                />
            </ActionCardHeader>
            <KeyValCardBody keyValPairs={tableInfo} />
        </Card>
    );
};
