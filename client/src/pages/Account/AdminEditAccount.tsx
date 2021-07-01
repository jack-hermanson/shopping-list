import { FC } from "react";
import { RouteComponentProps } from "react-router";
import { useProtectedRoute } from "../../utils/hooks";
import { Clearance } from "../../../../shared/enums";
import { useStoreActions, useStoreState } from "../../stores/_store";
import { Col, Row } from "reactstrap";
import { PageHeader } from "jack-hermanson-component-lib/lib";
import { EditAccountForm } from "../../components/Accounts/EditAccountForm";
import { scrollToTop } from "jack-hermanson-ts-utils";
import { useHistory } from "react-router-dom";

interface Props extends RouteComponentProps<{ id: string }> {}

export const AdminEditAccount: FC<Props> = ({ match }: Props) => {
    useProtectedRoute(Clearance.SUPER_ADMIN);

    const accountToEdit = useStoreState(state =>
        state.accounts?.find(a => a.id === parseInt(match.params.id))
    );
    const currentUser = useStoreState(state => state.currentUser);
    const adminEditAccount = useStoreActions(
        actions => actions.adminEditAccount
    );

    const history = useHistory();

    return (
        <div>
            <Row>
                <Col>
                    <PageHeader
                        title={`Edit ${accountToEdit?.username.capitalizeFirst()}`}
                    />
                </Col>
            </Row>
            <Row>
                <Col>{renderForm()}</Col>
            </Row>
        </div>
    );

    function renderForm() {
        if (accountToEdit && currentUser?.token) {
            return (
                <EditAccountForm
                    account={accountToEdit}
                    onSubmit={async formBody => {
                        try {
                            await adminEditAccount({
                                accountId: parseInt(match.params.id),
                                editAccountReq: {
                                    username: formBody.username,
                                    password: formBody.password,
                                    clearance: formBody.clearance,
                                },
                                token: currentUser.token!,
                            });
                            history.push("/manage/users");
                        } catch (error) {
                            console.error(error);
                            scrollToTop();
                        }
                    }}
                />
            );
        }
    }
};
