import { ReactNode, FC, Fragment } from "react";
import { CONTAINER_FLUID } from "../../utils/constants";
import { Container } from "reactstrap";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

interface Props {
    children: ReactNode;
}

export const Layout: FC<Props> = ({ children }: Props) => {
    return (
        <Fragment>
            <div className="body-container">
                <Navigation />
                <Container className="main-container" fluid={CONTAINER_FLUID}>
                    {children}
                </Container>
                <Footer />
            </div>
        </Fragment>
    );
};
