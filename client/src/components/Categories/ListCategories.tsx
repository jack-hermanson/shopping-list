import { FC } from "react";
import { useStoreState } from "../../store";
import { LoadingSpinner } from "jack-hermanson-component-lib/lib";
import { ListCategory } from "./ListCategory";

/*
This component renders the categories on the list.
It should not be used to render a list of categories
for meta/administrative purposes.
 */
export const ListCategories: FC = () => {
    const categories = useStoreState(state => state.categories);
    console.log("render categories");

    return (
        <div>
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
