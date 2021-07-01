import { FC } from "react";
import { Col, Row, Table } from "reactstrap";
import { ManageTabs } from "../../components/Manage/ManageTabs";
import { PageHeader } from "jack-hermanson-component-lib/lib";
import { useProtectedRoute } from "../../utils/hooks";
import { Clearance } from "../../../../shared/enums";
import { useStoreState } from "../../stores/_store";

export const UsersIndex: FC = () => {
    useProtectedRoute(Clearance.ADMIN);

    const users = useStoreState(state => state.accounts);
    const currentUser = useStoreState(state => state.currentUser);

    return (
        <div>
            <ManageTabs />
            <Row>
                <Col>
                    <PageHeader title="Users" />
                </Col>
            </Row>
            <Row>
                <Col>{renderTable()}</Col>
            </Row>
        </div>
    );

    function renderTable() {
        if (users && currentUser) {
            const isSuperAdmin =
                currentUser.clearance === Clearance.SUPER_ADMIN;
            return (
                <Table striped>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Clearance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td
                                    onClick={
                                        isSuperAdmin
                                            ? () => {
                                                  console.log("ok");
                                              }
                                            : undefined
                                    }
                                    className={
                                        isSuperAdmin ? "hover-mouse" : ""
                                    }
                                >
                                    {user.id}
                                </td>
                                <td>{user.username.capitalizeFirst()}</td>
                                <td>{user.clearance}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            );
        }
    }
};
