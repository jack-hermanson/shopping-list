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

    return (
        <div>
            <ManageTabs />
            <Row>
                <Col>
                    <PageHeader title="Users" />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table striped>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.username.capitalizeFirst()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </div>
    );
};
