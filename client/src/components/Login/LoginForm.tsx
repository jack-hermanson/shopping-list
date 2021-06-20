import { FC, FormEvent, useState } from "react";
import { FormGroup, Label, Input, Button } from "reactstrap";
import { LoginOrNewAccountRequest } from "../../../../shared/resource_models/account";

interface Props {
    onSubmit: (loginRequest: LoginOrNewAccountRequest) => any;
}

export const LoginForm: FC<Props> = ({ onSubmit }: Props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <form onSubmit={submit}>
            {renderUsername()}
            {renderPassword()}
            {renderButtons()}
        </form>
    );

    function submit(e: FormEvent) {
        e.preventDefault();
        onSubmit({
            username,
            password,
        });
    }

    function renderUsername() {
        const id = "username-input";
        return (
            <FormGroup>
                <Label className="form-label" for={id}>
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
                <Label className="form-label" for={id}>
                    Password
                </Label>
                <Input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    id={id}
                />
            </FormGroup>
        );
    }

    function renderButtons() {
        return (
            <div>
                <Button color="primary">Log In</Button>
                <Button color="secondary">Reset</Button>
            </div>
        );
    }
};
