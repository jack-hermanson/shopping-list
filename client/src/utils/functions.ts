import * as package_json from "../../../package.json";

export function getVersionNumber(): string {
    return package_json.version;
}

export function getRedirectPath(): string | null {
    return localStorage.getItem("redirectPath");
}

export function removeRedirectPath(): void {
    localStorage.removeItem("redirectPath");
}

export function setRedirectPath(path: string): void {
    localStorage.setItem("redirectPath", path);
}
