export class NoAuthError extends Error {
    constructor() {
        super("Not authenticated");
    }
}
