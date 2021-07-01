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
import { useStoreActions, useStoreState } from "./stores/store";
import { Forbidden } from "./pages/Errors/Forbidden";
import { SocketConnection } from "./components/Utils/SocketConnection";
import { Index as Categories } from "./pages/Categories/Index";
import { Dashboard as ManageDashboard } from "./pages/Manage/Dashboard";

function App() {
    const logInFromStorage = useStoreActions(
        actions => actions.logInFromStorage
    );
    const loadCategories = useStoreActions(actions => actions.loadCategories);
    const loadItems = useStoreActions(actions => actions.loadItems);
    const currentUser = useStoreState(state => state.currentUser);
    const loadAccounts = useStoreActions(actions => actions.loadAccounts);

    useEffect(() => {
        logInFromStorage().then(() => {
            if (currentUser?.token) {
                loadCategories(currentUser.token);
                loadItems(currentUser.token);
                loadAccounts(currentUser.token);
            }
        });
    }, [
        logInFromStorage,
        loadCategories,
        loadItems,
        loadAccounts,
        currentUser?.token,
    ]);

    return (
        <BrowserRouter>
            <SocketConnection />
            <Layout>
                {renderAlerts()}
                <Switch>
                    <Route exact path="/" component={ListIndex} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/account" component={Account} />

                    <Route exact path="/manage" component={ManageDashboard} />
                    <Route
                        exact
                        path="/manage/categories"
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
