import "./css/main.css";
import { Alerts } from "./components/Alerts/Alerts";
import { Layout } from "./components/Layout/Layout";
import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import { getVersionNumber } from "./utils/functions";

function App() {
    useEffect(() => {
        getVersionNumber();
    });

    return (
        <BrowserRouter>
            <Layout>
                <Alerts />
                <p>Inside main layout</p>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
