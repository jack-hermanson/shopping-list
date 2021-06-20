import { ResourceModel } from "./_base";
import { Clearance } from "../enums";

export interface AccountRecord extends ResourceModel {
    username: string;
    token?: string;
    clearance: Clearance;
}

export interface LoginOrNewAccountRequest {
    username: string;
    password: string;
}
