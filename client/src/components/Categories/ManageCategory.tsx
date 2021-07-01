import { FC } from "react";
import { CategoryRecord } from "../../../../shared/resource_models/category";
import { Card } from "reactstrap";
import {
    ActionCardHeader,
    ActionsDropdown,
    KeyValCardBody,
} from "jack-hermanson-component-lib";
import {
    ClickDropdownAction,
    DropdownAction,
    KeyValPair,
} from "jack-hermanson-ts-utils";
import { useStoreState } from "../../stores/_store";

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
    const items = useStoreState(state => state.items);

    const tableInfo: KeyValPair[] = [
        {
            key: "Notes",
            val: category.notes ? (
                category.notes
            ) : (
                <span className="fst-italic text-muted ps-0">none</span>
            ),
        },
        { key: "Visible", val: category.visible.toString() },
        {
            key: "Items",
            val: items?.filter(i => i.categoryIds.includes(category.id)).length,
        },
    ];

    const dropdownOptions: Array<DropdownAction | undefined> = [];
    dropdownOptions.push(
        new ClickDropdownAction("Edit", () => edit(category)),
        undefined,
        new ClickDropdownAction("Delete", () => deleteCategory(category))
    );

    return (
        <Card className="mb-3 no-mb-last">
            <ActionCardHeader title={category.name}>
                <ActionsDropdown size="sm" options={dropdownOptions} />
            </ActionCardHeader>
            <KeyValCardBody keyValPairs={tableInfo} />
        </Card>
    );
};
