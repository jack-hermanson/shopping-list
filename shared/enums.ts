export enum SocketEvent {
    UPDATE_CATEGORY = "update_category", // only re-fetch 1; send with an id
    UPDATE_CATEGORIES = "update_categories", // re-fetch all; no data in msg
}

export enum Clearance {
    NONE = 0,
    NORMAL = 1,
    ADMIN = 2,
    SUPER_ADMIN = 5,
}
