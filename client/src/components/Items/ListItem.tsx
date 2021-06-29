import { FC, Fragment } from "react";
import { ItemRecord } from "../../../../shared/resource_models/item";
import { Button, Input, Label, Modal } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

interface Props {
    item: ItemRecord;
    categoryId: number;
}

export const ListItem: FC<Props> = ({ item, categoryId }: Props) => {
    return (
        <Fragment>
            <tr>
                <td className="w-100">{renderInfo()}</td>
                <td className="ms-auto hover-mouse ps-3">
                    <i className="fas fa-info-circle px-0" />
                </td>
            </tr>
        </Fragment>
    );

    function renderInfo() {
        const id = `item-${item.id}-category-${categoryId}-input`;
        return (
            <div className="ps-0 d-flex">
                <Input id={id} className="me-2 checkbox-lg" type="checkbox" />
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
};
