import { FC, useState } from "react";
import {
    Collapse,
    Container,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavItem,
} from "reactstrap";
import { APP_NAME, CONTAINER_FLUID } from "../../utils/constants";
import { NavLink, useHistory } from "react-router-dom";
import {
    faClipboardList,
    faCogs,
    faShoppingCart,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FA } from "@fortawesome/react-fontawesome";
import { useStoreState } from "../../stores/_store";
import { Clearance } from "../../../../shared/enums";

export const Navigation: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(o => !o);
    const history = useHistory();
    const currentUser = useStoreState(state => state.currentUser);

    return (
        <Navbar dark color="secondary" className="mb-1 px-0" expand="lg">
            <Container fluid={CONTAINER_FLUID}>
                <NavbarBrand
                    onClick={() => {
                        history.push("/");
                        setIsOpen(false);
                    }}
                    className="hover-mouse mb-1"
                >
                    <FA className="me-2" icon={faShoppingCart} /> {APP_NAME}
                </NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav navbar style={{ marginRight: "auto" }}>
                        {/*{renderChores()}*/}
                        {renderManage()}
                    </Nav>
                    <Nav navbar style={{ marginLeft: "auto" }}>
                        <NavItem>
                            <NavLink
                                onClick={() => setIsOpen(false)}
                                to={"/account"}
                                className="nav-link"
                            >
                                <FA className="me-1" icon={faUser} />
                                {currentUser
                                    ? currentUser.username.capitalizeFirst()
                                    : "Account"}
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Container>
        </Navbar>
    );

    function renderManage() {
        if (currentUser && currentUser.clearance >= Clearance.ADMIN) {
            return (
                <NavItem>
                    <NavLink
                        onClick={() => setIsOpen(false)}
                        to={"/manage"}
                        className="nav-link"
                    >
                        <FA className="me-1" icon={faCogs} />
                        Manage
                    </NavLink>
                </NavItem>
            );
        }
    }

    function renderChores() {
        if (currentUser && currentUser.clearance >= Clearance.NORMAL) {
            return (
                <NavItem>
                    <NavLink
                        onClick={() => setIsOpen(false)}
                        to={"/chores"}
                        className="nav-link"
                    >
                        <FA icon={faClipboardList} className="me-1" />
                        Chores
                    </NavLink>
                </NavItem>
            );
        }
    }
};
