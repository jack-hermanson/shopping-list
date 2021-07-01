import { Dispatch, FC, SetStateAction, useState, Fragment } from "react";
import { ItemRecord } from "../../../../shared/resource_models/item";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { CreateEditItemForm } from "./CreateEditItemForm";
import { scrollToTop } from "jack-hermanson-ts-utils";
import * as timeago from "timeago.js";
import { Clearance } from "../../../../shared/enums";
import { useStoreActions, useStoreState } from "../../stores/_store";
import { ConfirmationModal } from "jack-hermanson-component-lib/lib";

interface Props {
    item: ItemRecord;
    showModal: boolean;
    setShowModal: Dispatch<SetStateAction<boolean>>;
}

export const ItemModal: FC<Props> = ({
    item,
    showModal,
    setShowModal,
}: Props) => {
    const currentUser = useStoreState(state => state.currentUser);
    const accounts = useStoreState(state => state.accounts);
    const updateItem = useStoreActions(actions => actions.updateItem);
    const deleteItem = useStoreActions(actions => actions.deleteItem);

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const toggle = () => setShowModal(s => !s);

    return (
        <Fragment>
            <Modal isOpen={showModal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Edit Item</ModalHeader>
                <ModalBody>
                    {renderForm()}
                    <hr />
                    <div className="d-flex">
                        {renderLastUpdated()}
                        {renderDeleteButton()}
                    </div>
                </ModalBody>
            </Modal>
            {renderDeleteConfirmation()}
        </Fragment>
    );

    function renderForm() {
        return (
            <CreateEditItemForm
                onSubmit={async editedItem => {
                    setShowModal(false);
                    if (currentUser?.token) {
                        try {
                            await updateItem({
                                id: item.id,
                                token: currentUser.token,
                                item: editedItem,
                            });
                        } catch (error) {
                            console.error(error);
                            scrollToTop();
                        }
                    }
                }}
                autoFocus={true}
                existingItem={item}
            />
        );
    }

    function renderLastUpdated() {
        if (accounts && item.accountId) {
            const lastUpdatedUsername = accounts.find(
                a => a.id === item.accountId
            )?.username;

            return (
                <small className="text-muted my-auto">
                    Last updated {timeago.format(item.updated)} by{" "}
                    {lastUpdatedUsername?.capitalizeFirst()}.
                </small>
            );
        }
    }

    function renderDeleteButton() {
        if (currentUser && currentUser.clearance >= Clearance.ADMIN) {
            return (
                <small className="ms-auto">
                    <Button
                        type="button"
                        size="sm"
                        color="danger"
                        onClick={() => setShowDeleteConfirmation(true)}
                    >
                        Delete
                    </Button>
                </small>
            );
        }
    }

    function renderDeleteConfirmation() {
        if (currentUser && currentUser.clearance >= Clearance.ADMIN) {
            return (
                <ConfirmationModal
                    isOpen={showDeleteConfirmation}
                    setIsOpen={setShowDeleteConfirmation}
                    title="Confirm Item Deletion"
                    onConfirm={submitDeleteItem}
                    buttonColor="danger"
                    buttonText="Delete"
                >
                    <p className="mb-0">
                        Are you sure you want to delete the item "{item.name}"?
                        This cannot be undone.
                    </p>
                </ConfirmationModal>
            );
        }
    }

    async function submitDeleteItem() {
        if (currentUser?.token) {
            try {
                await deleteItem({ itemId: item.id, token: currentUser.token });
            } catch (error) {
                console.error(error);
                scrollToTop();
            }
            setShowDeleteConfirmation(false);
            setShowModal(false);
        }
    }
};
