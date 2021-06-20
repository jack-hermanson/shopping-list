import * as package_json from "../../../package.json";

export function getVersionNumber(): string {
    return package_json.version;
}
