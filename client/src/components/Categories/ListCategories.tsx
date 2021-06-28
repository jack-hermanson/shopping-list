import { FC } from "react";
import { useStoreState } from "../../store";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib/lib";
import { ListCategory } from "./ListCategory";
import { Button } from "reactstrap";

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
                <Button size="sm" color="info">
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
