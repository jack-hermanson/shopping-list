import { FC, Fragment, useState } from "react";
import { ItemRecord } from "../../../../shared/resource_models/item";
import { Input, Label } from "reactstrap";
import { useStoreActions, useStoreState } from "../../stores/_store";
import { ItemModal } from "./ItemModal";

interface Props {
    item: ItemRecord;
    categoryId?: number;
}

export const ListItem: FC<Props> = ({ item, categoryId }: Props) => {
    const [showInfoModal, setShowInfoModal] = useState(false);
    const toggleItemCheck = useStoreActions(actions => actions.toggleItemCheck);
    const currentUser = useStoreState(state => state.currentUser);
    const changeItem = useStoreActions(actions => actions.changeItem);

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
        const id = `item-${item.id}-category-${
            categoryId || Math.random()
        }-input`;
        return (
            <div className="ps-0 d-flex">
                <Input
                    id={id}
                    className="me-2 checkbox-lg"
                    type="checkbox"
                    checked={item.checked}
                    onChange={async event => {
                        if (currentUser?.token) {
                            changeItem({
                                ...item,
                                checked: event.target.checked,
                            });
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
                    {item.name.capitalizeFirst()}
                    {item.repeats && (
                        <span
                            style={{
                                height: "14px",
                                fontSize: "10px",
                                verticalAlign: "middle",
                            }}
                            className="ps-1 fas fa-sync"
                        />
                    )}
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
        return (
            <ItemModal
                item={item}
                showModal={showInfoModal}
                setShowModal={setShowInfoModal}
            />
        );
    }
};
