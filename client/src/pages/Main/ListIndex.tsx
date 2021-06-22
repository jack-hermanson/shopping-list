import { FC } from "react";
import { Col, Row } from "reactstrap";
import { useProtectedRoute } from "../../utils/hooks";
import { Clearance } from "../../../../shared/enums";

export const ListIndex: FC = () => {
    useProtectedRoute(Clearance.NORMAL);

    return (
        <div>
            <Row>
                <Col>
                    <p>List index</p>
                </Col>
            </Row>
        </div>
    );
};
