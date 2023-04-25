import { Fragment, FunctionComponent } from "react";
import {
    LoadingSpinner,
    MobileToggleCard,
    PageHeader,
} from "jack-hermanson-component-lib/lib";
import { Col, Row } from "reactstrap";
import { useStoreActions, useStoreState } from "../../stores/_store";
import { ChoreGlance } from "../../components/Chores/ChoreGlance";
import { ChoreLogGlance } from "../../components/Chores/ChoreLogGlance";

export const ChoresIndex: FunctionComponent = () => {
    const chores = useStoreState(state => state.chores);
    const choreLogs = useStoreState(state => state.choreLogs);

    return (
        <div>
            <PageHeader title={"Chores"} />
            <Row>
                <Col xs={12} lg={8} className="order-2 order-lg-1">
                    {!choreLogs ? (
                        <LoadingSpinner />
                    ) : (
                        <Fragment>
                            {choreLogs.map(choreLog => (
                                <ChoreLogGlance
                                    choreLog={choreLog}
                                    key={choreLog.id}
                                />
                            ))}
                        </Fragment>
                    )}
                </Col>
                <Col xs={12} lg={4} className="order-1 order-lg-2 mb-3 mb-lg-0">
                    <MobileToggleCard cardTitle="Filtering">
                        <p>Some filter</p>
                    </MobileToggleCard>
                </Col>
            </Row>
        </div>
    );
};
