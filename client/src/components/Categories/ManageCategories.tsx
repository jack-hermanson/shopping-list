import { FC } from "react";
import { useStoreState } from "../../store";
import { LoadingSpinner } from "jack-hermanson-component-lib/lib";
import { ManageCategory } from "./ManageCategory";

export const ManageCategories: FC = () => {
    const categories = useStoreState(state => state.categories);

    return (
        <div>
            {categories ? (
                <div>
                    {categories.map(category => (
                        <ManageCategory category={category} key={category.id} />
                    ))}
                </div>
            ) : (
                <LoadingSpinner />
            )}
        </div>
    );
};
