import { FC } from "react";
import { useStoreActions, useStoreState } from "../../stores/_store";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib/lib";
import { ListCategory } from "./ListCategory";
import { ActionsDropdown } from "jack-hermanson-component-lib";
import { ClickDropdownAction, scrollToTop } from "jack-hermanson-ts-utils";

/*
This component renders the categories on the list.
It should not be used to render a list of categories
for meta/administrative purposes.
 */
export const ListCategories: FC = () => {
    const categories = useStoreState(state => state.categories);
    const currentUser = useStoreState(state => state.currentUser);
    const completeAllCategories = useStoreActions(
        actions => actions.completeAllCategories
    );
    const toggleCategoryItems = useStoreActions(
        actions => actions.toggleCategoryItems
    );

    return (
        <div>
            <PageHeader title="Shopping List">
                <ActionsDropdown
                    color="info"
                    size="sm"
                    options={[
                        new ClickDropdownAction("New Item", () => {
                            const newItemNameInput =
                                document.getElementById("new-item-name");
                            newItemNameInput?.focus();
                            newItemNameInput?.scrollIntoView();
                        }),
                        new ClickDropdownAction("Complete All", async () => {
                            if (currentUser?.token) {
                                try {
                                    await completeAllCategories(
                                        currentUser.token
                                    );
                                } catch (error) {
                                    console.error(error);
                                    scrollToTop();
                                }
                            }
                        }),
                        undefined,
                        new ClickDropdownAction("Check All", async () => {
                            if (currentUser?.token && categories) {
                                try {
                                    for (let category of categories) {
                                        await toggleCategoryItems({
                                            checkAll: true,
                                            id: category.id,
                                            token: currentUser.token,
                                        });
                                    }
                                } catch (error) {
                                    console.error(error);
                                    scrollToTop();
                                }
                            }
                        }),
                        new ClickDropdownAction("Uncheck All", async () => {
                            if (currentUser?.token && categories) {
                                try {
                                    for (let category of categories) {
                                        await toggleCategoryItems({
                                            checkAll: false,
                                            id: category.id,
                                            token: currentUser.token,
                                        });
                                    }
                                } catch (error) {
                                    console.error(error);
                                    scrollToTop();
                                }
                            }
                        }),
                    ]}
                />
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
