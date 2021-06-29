import { FC } from "react";
import { CategoryRecord } from "../../../../shared/resource_models/category";
import { Card } from "reactstrap";
import {
    ActionCardHeader,
    ActionsDropdown,
    KeyValCardBody,
} from "jack-hermanson-component-lib";
import { ClickDropdownAction, KeyValPair } from "jack-hermanson-ts-utils";

interface Props {
    category: CategoryRecord;
    edit: (category: CategoryRecord) => any;
    deleteCategory: (category: CategoryRecord) => any;
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
                    size="sm"
                    options={[
                        new ClickDropdownAction("Edit", () => edit(category)),
                        undefined,
                        new ClickDropdownAction("Delete", () =>
                            deleteCategory(category)
                        ),
                    ]}
                />
            </ActionCardHeader>
            <KeyValCardBody keyValPairs={tableInfo} />
        </Card>
    );
};
