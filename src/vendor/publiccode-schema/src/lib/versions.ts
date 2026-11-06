import { versions } from "./vocab";

// Values the parser accepts for publiccodeYmlVersion. It validates all of them
// with the same (v0) rules; "0" means "the latest 0.x".
export const PARSER_VERSIONS: readonly string[] = versions;

// Versions of the standard whose rules differ, one generated schema each
// (0.6.0 changed nothing in the standard). 0.8.0 is known but the parser
// stops at 0.7: its changes are reported as deprecation warnings only.
export const SCHEMA_VERSIONS = [
	"0.2.0",
	"0.3.0",
	"0.4.0",
	"0.5.0",
	"0.7.0",
	"0.8.0",
] as const;

export type SchemaVersion = (typeof SCHEMA_VERSIONS)[number];

// The latest version the parser (and so the editor's validators) accepts.
export const LATEST_SUPPORTED: SchemaVersion = "0.7.0";
// The latest version of the standard.
export const LATEST_KNOWN: SchemaVersion = "0.8.0";

const parts = (v: string) => v.split(".").map((n) => Number.parseInt(n, 10));

// "0.5" -> "0.5.0", "0" -> the latest supported version.
export function normalizeVersion(version: string): string {
	if (version === "0") return LATEST_SUPPORTED;

	const [major = 0, minor = 0, patch = 0] = parts(version);

	return `${major}.${minor}.${patch}`;
}

export function compareVersions(a: string, b: string): number {
	const pa = parts(normalizeVersion(a));
	const pb = parts(normalizeVersion(b));

	for (let i = 0; i < 3; i++) {
		if (pa[i] !== pb[i]) return pa[i] - pb[i];
	}

	return 0;
}

export const isAtLeast = (version: string, min: string) =>
	compareVersions(version, min) >= 0;

export const isVersion = (value: unknown): value is string =>
	typeof value === "string" && /^\d+(\.\d+){0,2}$/.test(value);

// The schema whose rules apply to a declared version, e.g. "0.2.1" -> "0.2.0".
// Versions older than the first schema use it; newer ones use the latest.
export function schemaVersionFor(declared: string): SchemaVersion {
	let match: SchemaVersion = SCHEMA_VERSIONS[0];

	for (const v of SCHEMA_VERSIONS) {
		if (isAtLeast(declared, v)) match = v;
	}

	return match;
}

export const isSupportedByParser = (declared: string) =>
	PARSER_VERSIONS.includes(declared);
