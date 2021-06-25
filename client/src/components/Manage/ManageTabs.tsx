import { FC } from "react";
import { NavTabs } from "jack-hermanson-component-lib";
export const ManageTabs: FC = () => {
    return (
        <div>
            <NavTabs
                links={[
                    { path: "/manage", text: "Dashboard", exact: true },
                    { path: "/manage/categories", text: "Categories" },
                    { path: "/manage/users", text: "Users" },
                ]}
            />
        </div>
    );
};
