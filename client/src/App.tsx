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
import { useStoreActions } from "./stores/_store";
import { Forbidden } from "./pages/Errors/Forbidden";
import { SocketConnection } from "./components/Utils/SocketConnection";
import { CategoriesIndex } from "./pages/Categories/CategoriesIndex";
import { Dashboard as ManageDashboard } from "./pages/Manage/Dashboard";
import { UsersIndex } from "./pages/Users/UsersIndex";
import { AdminEditAccount } from "./pages/Account/AdminEditAccount";
import { ChoresIndex } from "./pages/Chores/ChoresIndex";

function App() {
    const logInFromStorage = useStoreActions(
        actions => actions.logInFromStorage
    );

    useEffect(() => {
        logInFromStorage();
    }, [logInFromStorage]);

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
                        component={CategoriesIndex}
                    />
                    <Route exact path="/manage/users" component={UsersIndex} />
                    <Route
                        exact
                        path="/manage/users/:id"
                        component={AdminEditAccount}
                    />

                    <Route exact path="/chores" component={ChoresIndex} />

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
