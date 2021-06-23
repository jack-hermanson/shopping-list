import "./css/main.css";
import { Alerts } from "./components/Alerts/Alerts";
import { Layout } from "./components/Layout/Layout";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { ListIndex } from "./pages/Main/ListIndex";
import { NotFound } from "./pages/Errors/NotFound";
import { Login } from "./pages/Account/Login";
import { Account } from "./pages/Account/Account";
import { useEffect } from "react";
import { useStoreActions, useStoreState } from "./store";
import { Forbidden } from "./pages/Errors/Forbidden";
import { SocketConnection } from "./components/Utils/SocketConnection";
import { Index as Categories } from "./pages/Categories/Index";
import { Index as ManageIndex } from "./pages/Manage/Index";

function App() {
    const logInFromStorage = useStoreActions(
        actions => actions.logInFromStorage
    );
    const loadCategories = useStoreActions(actions => actions.loadCategories);
    const currentUser = useStoreState(state => state.currentUser);

    useEffect(() => {
        logInFromStorage().then(() => {
            if (currentUser?.token) {
                loadCategories(currentUser.token);
            }
        });
    }, [logInFromStorage, loadCategories, currentUser?.token]);

    return (
        <BrowserRouter>
            <SocketConnection />
            <Layout>
                {renderAlerts()}
                <Switch>
                    <Route exact path="/" component={ListIndex} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/account" component={Account} />

                    <Route path="/manage" component={ManageIndex} />
                    <Route
                        exact
                        path="manage/categories"
                        component={Categories}
                    />

                    <Route exact path="/forbidden" component={Forbidden} />
                    <Route component={NotFound} />
                </Switch>
            </Layout>
        </BrowserRouter>
    );

    function renderAlerts() {
        return (
            <Row>
                <Col>
                    <Alerts />
                </Col>
            </Row>
        );
    }
}

export default App;
