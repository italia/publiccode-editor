import { LATEST_VERSION } from "./contents/publiccode";

interface SemVerObject {
    originalString?: string;
    semVer?: string;
    major: string;
    dotMinor?: string;
    minor: string;
    dotPatch?: string;
    patch: string;
    prerelease?: string;
    buildmetadata?: string;
}

const SEMVER_WITH_PREFIX_REGEX = /^[\^~]?((0|[1-9]\d*)(\.(0|[1-9]\d*))?(\.(0|[1-9]\d*))?)(?:-((?:0|[1-9A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9A-Za-z-][0-9A-Za-z-]*))*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

export function toSemVerObject(versionString: string) {
    const [
        originalString,
        semVer,
        major = "0",
        dotMinor = '.0',
        minor = '0',
        dotPatch = '.0',
        patch = '0',
        prerelease,
        buildmetadata
    ] = versionString.match(SEMVER_WITH_PREFIX_REGEX) ?? [];

    return {
        originalString,
        semVer,
        major,
        dotMinor,
        minor,
        dotPatch,
        patch,
        prerelease,
        buildmetadata
    } satisfies SemVerObject;
}

export const isMinorThanLatest = (semver: SemVerObject) => {
    const latest = toSemVerObject(LATEST_VERSION);

    if (+semver.major < +latest.major) {
        return true
    }

    if (+semver.minor < +latest.minor) {
        return true

    }

    if (+semver.patch < +latest.patch) {
        return true

    }

    return false;

}