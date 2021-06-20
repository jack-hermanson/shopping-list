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
import { useStoreActions } from "./store";

function App() {
    const logInFromStorage = useStoreActions(
        actions => actions.logInFromStorage
    );

    useEffect(() => {
        logInFromStorage();
    });

    return (
        <BrowserRouter>
            <Layout>
                {renderAlerts()}
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
