import { Fragment, FunctionComponent } from "react";
import { LoadingSpinner, PageHeader } from "jack-hermanson-component-lib/lib";
import { Col, Row } from "reactstrap";
import { useStoreState } from "../../stores/_store";
import { ChoreGlance } from "../../components/Chores/ChoreGlance";

export const ChoresIndex: FunctionComponent = () => {
    const chores = useStoreState(state => state.chores);

    return (
        <div>
            <PageHeader title={"Chores"} />
            <Row>
                <Col>
                    {!chores ? (
                        <LoadingSpinner />
                    ) : (
                        <Fragment>
                            {chores.map(chore => (
                                <ChoreGlance chore={chore} key={chore.id} />
                            ))}
                        </Fragment>
                    )}
                </Col>
            </Row>
        </div>
    );
};
