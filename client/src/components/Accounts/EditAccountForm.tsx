import { FC, useState } from "react";
import { AccountRecord } from "../../../../shared/resource_models/account";
import { Button, FormGroup, Input, Label } from "reactstrap";
import { useStoreState } from "../../stores/_store";
import { Clearance } from "../../../../shared/enums";
import { FormError } from "jack-hermanson-component-lib";

interface Props {
    account: AccountRecord;
    onSubmit: (formBody: {
        username: string;
        password: string | undefined;
        clearance: Clearance;
    }) => any;
}

export const EditAccountForm: FC<Props> = ({ account, onSubmit }: Props) => {
    const currentUser = useStoreState(state => state.currentUser);

    const [username, setUsername] = useState(account.username);
    const [password, setPassword] = useState("");
    const [clearance, setClearance] = useState<Clearance | "">(
        account.clearance
    );
    const [clearanceError, setClearanceError] = useState(false);

    return (
        <form
            onSubmit={event => {
                event.preventDefault();
                if (clearance !== "") {
                    onSubmit({
                        username,
                        password: password.length ? password : undefined,
                        clearance,
                    });
                }
            }}
            onReset={event => {
                event.preventDefault();
                setUsername(account.username);
                setPassword("");
                setClearance(account.clearance);
            }}
        >
            {renderUsername()}
            {renderPassword()}
            {renderClearance()}
            {renderButtons()}
        </form>
    );

    function renderUsername() {
        const id = "username-input";
        return (
            <FormGroup>
                <Label for={id} className="form-label required">
                    Username
                </Label>
                <Input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    id={id}
                    required
                />
            </FormGroup>
        );
    }

    function renderPassword() {
        const id = "password-input";
        return (
            <FormGroup>
                <Label for={id} className="form-label">
                    Password
                </Label>
                <Input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    id={id}
                    placeholder="Leave blank to keep current password"
                />
            </FormGroup>
        );
    }

    function renderClearance() {
        const id = "clearance-input";
        const placeholder = `${Clearance.NONE}, ${Clearance.NORMAL}, ${Clearance.ADMIN}, ${Clearance.SUPER_ADMIN}`;
        if (currentUser && currentUser.clearance >= Clearance.SUPER_ADMIN) {
            return (
                <FormGroup>
                    <Label for={id} className="form-label required">
                        Clearance
                    </Label>
                    <Input
                        type="tel"
                        min={Clearance.NONE}
                        max={Clearance.SUPER_ADMIN}
                        value={clearance}
                        placeholder={placeholder}
                        onChange={e => {
                            const parsedValue = parseInt(e.target.value);
                            switch (parsedValue) {
                                case Clearance.NONE:
                                case Clearance.NORMAL:
                                case Clearance.ADMIN:
                                case Clearance.SUPER_ADMIN:
                                    setClearance(parsedValue as Clearance);
                                    setClearanceError(false);
                                    break;
                                default:
                                    if (e.target.value.trim() !== "") {
                                        setClearanceError(true);
                                    }
                                    setClearance("");
                            }
                        }}
                    />
                    {clearanceError && (
                        <FormError>Incorrect value for clearance.</FormError>
                    )}
                </FormGroup>
            );
        }
    }

    function renderButtons() {
        return (
            <FormGroup className="bottom-buttons">
                <Button type="submit" color="info">
                    Save
                </Button>
                <Button type="reset" color="secondary">
                    Reset
                </Button>
            </FormGroup>
        );
    }
};
