import { FC } from "react";
import { useStoreState } from "../../store";

export const Categories: FC = () => {
    const categories = useStoreState(state => state.categories);
    console.log("render categories");

    return (
        <div>
            {categories ? (
                categories.map(c => <p key={c.id}>{c.name}</p>)
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};
