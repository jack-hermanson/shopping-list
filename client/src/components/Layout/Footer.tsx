import { FC } from "react";
import { Container } from "reactstrap";
import { CONTAINER_FLUID } from "../../utils/constants";

export const Footer: FC = () => {
    return (
        <div className="footer-container bg-secondary">
            <Container className="pb-3 pt-2 mt-2 px-0" fluid={CONTAINER_FLUID}>
                <span>Test</span>
            </Container>
        </div>
    );
};
