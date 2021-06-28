import { FC } from "react";
import { ItemRecord } from "../../../../shared/resource_models/item";

interface Props {
    item: ItemRecord;
}

export const ListItem: FC<Props> = ({ item }: Props) => {
    return (
        <tr>
            <td>{item.name}</td>
        </tr>
    );
};
