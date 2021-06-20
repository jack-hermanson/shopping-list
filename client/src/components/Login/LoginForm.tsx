import { FC, FormEvent, useState } from "react";
import { FormGroup, Label, Input, Button } from "reactstrap";
import { LoginOrNewAccountRequest } from "../../../../shared/resource_models/account";
import { scrollToTop } from "jack-hermanson-ts-utils";
import { useStoreActions } from "../../store";

interface Props {
    afterSubmit?: () => any;
}

export const LoginForm: FC<Props> = ({ afterSubmit }: Props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const logIn = useStoreActions(actions => actions.logIn);

    return (
        <form onSubmit={submit} onReset={reset}>
            {renderUsername()}
            {renderPassword()}
            {renderButtons()}
        </form>
    );

    async function submit(e: FormEvent) {
        e.preventDefault();

        const loginRequest: LoginOrNewAccountRequest = {
            username,
            password,
        };

        try {
            const token = await logIn(loginRequest);
            console.log(token);
        } catch (error) {
            console.log(error);
            scrollToTop();
        }

        afterSubmit?.();
    }

    function reset(e: FormEvent) {
        e.preventDefault();
        setUsername("");
        setPassword("");

        document.getElementById("username-input")?.focus();
    }

    function renderUsername() {
        const id = "username-input";
        return (
            <FormGroup>
                <Label className="form-label required" for={id}>
                    Username
                </Label>
                <Input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    id={id}
                    autoFocus
                />
            </FormGroup>
        );
    }

    function renderPassword() {
        const id = "password-input";
        return (
            <FormGroup>
                <Label className="form-label required" for={id}>
                    Password
                </Label>
                <Input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    id={id}
                    type="password"
                />
            </FormGroup>
        );
    }

    function renderButtons() {
        return (
            <div className="bottom-buttons">
                <Button type="submit" color="primary">
                    Log In
                </Button>
                <Button type="reset" color="secondary">
                    Reset
                </Button>
            </div>
        );
    }
};
