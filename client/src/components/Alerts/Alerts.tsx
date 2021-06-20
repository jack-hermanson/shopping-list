import React from "react";
import { useStoreActions, useStoreState } from "../../store";
import { AlertPanel } from "jack-hermanson-component-lib/lib";

export const Alerts: React.FC = () => {
    const alerts = useStoreState(state => state.alerts);
    const setAlerts = useStoreActions(actions => actions.setAlerts);

    return (
        <div>
            {alerts.map(alert => {
                const removeAlert = () =>
                    setAlerts(alerts.filter(a => a !== alert));
                const key = `${Math.random()}-${
                    alert.text ? alert.text : Math.random().toString()
                }`;
                return (
                    <AlertPanel
                        key={key}
                        alert={alert}
                        removeAlert={() => removeAlert()}
                    />
                );
            })}
        </div>
    );
};
