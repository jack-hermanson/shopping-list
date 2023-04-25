import { ResourceModel } from "./_base";

export interface ChoreLogRequest {
    choreId: number;
    completedDate?: Date;
    dueDate?: Date;
}

export interface ChoreLogRecord extends ChoreLogRequest, ResourceModel {
    accountId?: number;
    daysRemaining?: number;
}
