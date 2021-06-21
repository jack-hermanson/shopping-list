import "./css/main.css";
import { Alerts } from "./components/Alerts/Alerts";
import { Layout } from "./components/Layout/Layout";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { ListIndex } from "./pages/Main/ListIndex";
import { NotFound } from "./pages/Misc/NotFound";
import { Login } from "./pages/Account/Login";
import { Account } from "./pages/Account/Account";
import { useEffect } from "react";
import { useStoreActions, useStoreState } from "./store";
import { Categories } from "./components/Categories/Categories";

function App() {
    const logInFromStorage = useStoreActions(
        actions => actions.logInFromStorage
    );
    const loadCategories = useStoreActions(actions => actions.loadCategories);
    const currentUser = useStoreState(state => state.currentUser);

    useEffect(() => {
        logInFromStorage();
        loadCategories();
    }, [logInFromStorage, loadCategories]);

    return (
        <BrowserRouter>
            <Layout>
                {renderAlerts()}
                {currentUser ? (
                    <Categories />
                ) : (
                    <p>Log in to view categories.</p>
                )}

                <Switch>
                    <Route exact path="/" component={ListIndex} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/account" component={Account} />
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
