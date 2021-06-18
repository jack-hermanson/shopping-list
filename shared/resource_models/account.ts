import { ResourceModel } from "./_base";

export interface AccountRecord extends ResourceModel {
    username: string;
    token?: string;
}

export interface LoginOrNewAccountRequest {
    username: string;
    password: string;
}
