import { FunctionComponent, useEffect, useState } from "react";
import { ChoreLogRecord } from "../../../../shared/resource_models/choreLog";
import { ChoreRecord } from "../../../../shared/resource_models/chore";
import { AccountRecord } from "../../../../shared/resource_models/account";
import { Card, CardBody } from "reactstrap";
import { useStoreState } from "../../stores/_store";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface Props {
    choreLog: ChoreLogRecord;
}

export const ChoreLogGlance: FunctionComponent<Props> = ({ choreLog }) => {
    const chores = useStoreState(state => state.chores);
    const accounts = useStoreState(state => state.accounts);

    const [chore, setChore] = useState<ChoreRecord | undefined>(undefined);
    const [user, setUser] = useState<AccountRecord | undefined>(undefined);

    useEffect(() => {
        if (chores) {
            setChore(chores.find(c => c.id === choreLog.choreId));
        }
    }, [setChore, chores, choreLog]);

    useEffect(() => {
        if (accounts && choreLog.accountId) {
            setUser(accounts.find(a => a.id === choreLog.accountId));
        }
    }, [setUser, accounts, choreLog]);

    return (
        <Card className="mb-3 no-mb-last">
            <CardBody>
                <p>choreLog.id = {choreLog.id}</p>
                {chore && <p>chore.title = {chore.title}</p>}
                {choreLog.dueDate && (
                    <p>
                        Due: {dayjs(choreLog.dueDate).format("MM/DD/YY")} (
                        {dayjs(choreLog.dueDate).fromNow()})
                    </p>
                )}
                {choreLog.completedDate && (
                    <p>
                        Completed:{" "}
                        {dayjs(choreLog.completedDate).format("MM/DD/YY")} (
                        {dayjs(choreLog.completedDate).fromNow()})
                    </p>
                )}
            </CardBody>
        </Card>
    );
};
