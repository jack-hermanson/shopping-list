import { FC, Fragment, useState } from "react";
import { ItemRecord } from "../../../../shared/resource_models/item";
import { Input, Label, Modal, ModalBody, ModalHeader } from "reactstrap";
import { CreateEditItemForm } from "./CreateEditItemForm";
import { useStoreActions, useStoreState } from "../../store";
import { scrollToTop } from "jack-hermanson-ts-utils";

interface Props {
    item: ItemRecord;
    categoryId: number;
}

export const ListItem: FC<Props> = ({ item, categoryId }: Props) => {
    const [showInfoModal, setShowInfoModal] = useState(false);
    const updateItem = useStoreActions(actions => actions.updateItem);
    const toggleItemCheck = useStoreActions(actions => actions.toggleItemCheck);
    const currentUser = useStoreState(state => state.currentUser);

    return (
        <Fragment>
            <tr>
                <td className="w-100">{renderInfo()}</td>
                <td
                    className="ms-auto hover-mouse ps-3"
                    onClick={() => setShowInfoModal(true)}
                >
                    <i className="fas fa-info-circle px-0" />
                </td>
            </tr>
            {renderModal()}
        </Fragment>
    );

    function renderInfo() {
        const id = `item-${item.id}-category-${categoryId}-input`;
        return (
            <div className="ps-0 d-flex">
                <Input
                    id={id}
                    className="me-2 checkbox-lg"
                    type="checkbox"
                    checked={item.checked}
                    onChange={async event => {
                        if (currentUser?.token) {
                            await toggleItemCheck({
                                id: item.id,
                                checked: event.target.checked,
                                token: currentUser.token,
                            });
                        }
                    }}
                />
                <Label
                    for={id}
                    className="form-check-label my-auto line-height-1 hover-mouse"
                >
                    {item.name}
                    {item.notes && (
                        <span
                            style={{ fontSize: "12px", lineHeight: 1 }}
                            className="d-block text-muted ps-0 pt-1"
                        >
                            {item.notes}
                        </span>
                    )}
                </Label>
            </div>
        );
    }

    function renderModal() {
        const toggle = () => setShowInfoModal(o => !o);
        return (
            <Modal isOpen={showInfoModal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Edit Item</ModalHeader>
                <ModalBody>
                    <CreateEditItemForm
                        onSubmit={async editedItem => {
                            setShowInfoModal(false);
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
                </ModalBody>
            </Modal>
        );
    }
};
