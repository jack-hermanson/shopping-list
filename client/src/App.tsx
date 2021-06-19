import "./css/main.css";
import { Alerts } from "./components/Alerts/Alerts";
import { Layout } from "./components/Layout/Layout";
import { BrowserRouter } from "react-router-dom";

function App() {
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
