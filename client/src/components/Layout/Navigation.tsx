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
import { faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FA } from "@fortawesome/react-fontawesome";

export const Navigation: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(o => !o);

    return (
        <Navbar dark color="secondary" className="mb-4 px-0" expand="lg">
            <Container fluid={CONTAINER_FLUID}>
                <NavbarBrand className="hover-mouse">
                    <FA className="me-2" icon={faShoppingCart} /> {APP_NAME}
                </NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav navbar style={{ marginLeft: "auto" }}>
                        <NavItem>
                            <NavLink to={"/account"} exact className="nav-link">
                                <FA className="me-1" icon={faUser} /> Account
                            </NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Container>
        </Navbar>
    );
};
