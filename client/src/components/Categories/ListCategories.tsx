import { FC } from "react";
import { useStoreState } from "../../stores/_store";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib/lib";
import { ListCategory } from "./ListCategory";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/*
This component renders the categories on the list.
It should not be used to render a list of categories
for meta/administrative purposes.
 */
export const ListCategories: FC = () => {
    const categories = useStoreState(state => state.categories);

    return (
        <div>
            <PageHeader title="Shopping List">
                <Button
                    size="sm"
                    color="info"
                    onClick={() => {
                        const newItemNameInput =
                            document.getElementById("new-item-name");
                        newItemNameInput?.focus();
                        newItemNameInput?.scrollIntoView();
                    }}
                >
                    New Item
                </Button>
            </PageHeader>
            {categories ? (
                categories.map(category => (
                    <ListCategory category={category} key={category.id} />
                ))
            ) : (
                <LoadingSpinner />
            )}
        </div>
    );
};
