import { FC, Fragment } from "react";
import { Button, Col, Row } from "reactstrap";
import { useProtectedRoute } from "../../utils/hooks";
import { useStoreActions, useStoreState } from "../../stores/_store";
import { useHistory } from "react-router-dom";
import { getToken } from "../../utils/tokens";
import { PageHeader } from "jack-hermanson-component-lib/lib";
import { EditAccountForm } from "../../components/Accounts/EditAccountForm";
import { scrollToTop } from "jack-hermanson-ts-utils";

export const Account: FC = () => {
    const logOut = useStoreActions(actions => actions.logOut);
    const currentUser = useStoreState(state => state.currentUser);
    const editMyAccount = useStoreActions(actions => actions.editMyAccount);
    const history = useHistory();

    useProtectedRoute();

    return (
        <div>
            <Row>
                <Col>
                    <PageHeader title="Account">
                        {renderHeaderButtons()}
                    </PageHeader>
                </Col>
            </Row>
            <Row>
                <Col lg={8}>{renderForm()}</Col>
            </Row>
        </div>
    );

    function renderHeaderButtons() {
        return (
            <Fragment>
                <Button
                    size="sm"
                    outline={true}
                    color="secondary"
                    onClick={async () => {
                        const token = getToken();
                        await navigator.clipboard.writeText(
                            token || "No token"
                        );
                    }}
                >
                    Copy Token
                </Button>
                <Button
                    size="sm"
                    color="secondary"
                    onClick={() => {
                        if (currentUser?.token) {
                            logOut(currentUser.token).then(() => {
                                history.push("/login");
                            });
                        }
                    }}
                >
                    Log Out
                </Button>
            </Fragment>
        );
    }

    function renderForm() {
        if (currentUser?.token) {
            return (
                <EditAccountForm
                    account={currentUser}
                    onSubmit={async formBody => {
                        try {
                            await editMyAccount({
                                editAccountReq: {
                                    username: formBody.username,
                                    password: formBody.password,
                                },
                                token: currentUser.token!,
                            });
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
