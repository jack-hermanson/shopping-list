import { FC, useState } from "react";
import { useStoreActions, useStoreState } from "../../stores/_store";
import {
    ConfirmationModal,
    LoadingSpinner,
    PageHeader,
} from "jack-hermanson-component-lib/lib";
import { ListCategory } from "./ListCategory";
import { ActionsDropdown } from "jack-hermanson-component-lib";
import { ClickDropdownAction, scrollToTop } from "jack-hermanson-ts-utils";
import { UncheckedGroup } from "../UncheckedItems/UncheckedGroup";

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
    const showUncheckedGroup = useStoreState(state => state.showUncheckedGroup);

    const toggleAllItems = useStoreActions(actions => actions.toggleAllItems);
    const setShowUncheckedGroup = useStoreActions(
        actions => actions.setShowUncheckedGroup
    );

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    type ConfirmAction = "completeAll" | "checkAll" | "uncheckAll";
    const [confirmAction, setConfirmAction] = useState<
        ConfirmAction | undefined
    >(undefined);

    return (
        <div>
            <PageHeader title="Shopping List">
                {renderActionsDropdown()}
            </PageHeader>
            {renderUncheckedGroup()}
            {categories ? (
                categories.map(category => (
                    <ListCategory category={category} key={category.id} />
                ))
            ) : (
                <LoadingSpinner />
            )}
            {renderConfirmationModal()}
        </div>
    );

    function renderUncheckedGroup() {
        if (showUncheckedGroup) {
            return <UncheckedGroup />;
        }
    }

    function renderActionsDropdown() {
        const options = [
            new ClickDropdownAction("New Item", () => {
                const newItemNameInput =
                    document.getElementById("new-item-name");
                newItemNameInput?.focus();
                newItemNameInput?.scrollIntoView();
            }),
            new ClickDropdownAction("Complete All", () => {
                setConfirmAction("completeAll");
                setShowConfirmModal(true);
            }),
            undefined,
            new ClickDropdownAction("Check All", async () => {
                setConfirmAction("checkAll");
                setShowConfirmModal(true);
            }),
            new ClickDropdownAction("Uncheck All", async () => {
                setConfirmAction("uncheckAll");
                setShowConfirmModal(true);
            }),
            undefined,
        ];

        if (showUncheckedGroup) {
            options.push(
                new ClickDropdownAction("Hide Unchecked Group", () => {
                    setShowUncheckedGroup(false);
                })
            );
        } else {
            options.push(
                new ClickDropdownAction("Show Unchecked Group", () => {
                    setShowUncheckedGroup(true);
                })
            );
        }

        return <ActionsDropdown color="info" size="sm" options={options} />;
    }

    async function completeAll() {
        try {
            await completeAllCategories(currentUser!.token!);
        } catch (error) {
            console.error(error);
            scrollToTop();
        }
    }

    async function checkAll() {
        try {
            await toggleAllItems({
                token: currentUser!.token!,
                checked: true,
            });
        } catch (error) {
            console.error(error);
            scrollToTop();
        }
    }

    async function uncheckAll() {
        try {
            await toggleAllItems({
                token: currentUser!.token!,
                checked: false,
            });
        } catch (error) {
            console.error(error);
            scrollToTop();
        }
    }

    function renderConfirmationModal() {
        if (currentUser?.token && categories) {
            let title: string;
            let body: string;
            let onConfirm: () => Promise<any>;
            switch (confirmAction) {
                case "completeAll":
                    title = "Complete All";
                    body =
                        "complete all items? This will remove checked non-recurring items, but leave the rest unaffected.";
                    onConfirm = completeAll;
                    break;
                case "checkAll":
                    title = "Check All";
                    body = "mark all items as checked?";
                    onConfirm = checkAll;
                    break;
                case "uncheckAll":
                    title = "Uncheck All";
                    body = "mark all items as unchecked?";
                    onConfirm = uncheckAll;
                    break;
                default:
                    title = "";
                    body = "";
            }

            return (
                <ConfirmationModal
                    isOpen={showConfirmModal}
                    setIsOpen={setShowConfirmModal}
                    title={title}
                    onConfirm={async () => {
                        await onConfirm();
                        setShowConfirmModal(false);
                        setConfirmAction(undefined);
                    }}
                >
                    Are you sure you want to {body}
                </ConfirmationModal>
            );
        }
    }
};
