import { Fragment, FunctionComponent } from "react";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib/lib";
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
                <Col>
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
            </Row>
        </div>
    );
};
