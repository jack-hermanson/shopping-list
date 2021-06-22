import { FC } from "react";
import { Col, Row } from "reactstrap";
import { useProtectedRoute } from "../../utils/hooks";
import { Clearance } from "../../../../shared/enums";
import { ListCategories } from "../../components/Categories/ListCategories";

export const ListIndex: FC = () => {
    useProtectedRoute(Clearance.NORMAL);

    return (
        <div>
            <Row>
                <Col lg={9} className="mb-3 mb-lg-0">
                    <ListCategories />
                </Col>
                <Col lg={3}>
                    <p>Filtering</p>
                </Col>
            </Row>
        </div>
    );
};
