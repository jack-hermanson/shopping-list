import { ResourceModel } from "./_base";
import { Clearance } from "../enums";

export interface AccountRecord extends ResourceModel {
    username: string;
    clearance: Clearance;
}

export interface LoginOrNewAccountRequest {
    username: string;
    password: string;
}

export interface EditAccountRequest {
    username: string;
    password?: string;
}

export interface AdminEditAccountRequest extends EditAccountRequest {
    clearance: Clearance;
}
