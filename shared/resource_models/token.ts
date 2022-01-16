import { ResourceModel } from "./_base";

export interface TokenRecord extends ResourceModel {
    data: string;
    updated: Date;
    accountId: number;
    ipAddress?: string;
}

/**
 * Use this when the socket connection is first made
 * to update token's IP address and most recent use.
 */
export interface UseTokenRequest {
    ipAddress?: string;
}
