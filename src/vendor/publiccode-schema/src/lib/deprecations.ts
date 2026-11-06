import { type Data, find, get, isObject, remove } from "./paths";

export interface Occurrence {
	key: string;
	// Values for the message, e.g. { value: "IT" }.
	params?: Record<string, string>;
}

export interface UpgradeContext {
	// Target version of the upgrade.
	to: string;
	// Adds a `supports` entry unless it's already there.
	addSupport(data: Data, id: string): void;
}

export interface Deprecation {
	// i18n key: deprecations.<id>.message / .hint
	id: string;
	since: string;
	// English message, with {param} placeholders. Where the parser reports the
	// same deprecation, this is its wording.
	message: string;
	// The parser reports it too, as a warning on the same key.
	parser?: boolean;
	// Only an ISO 3166-1 alpha-2 code for deprecations in a country section.
	country?: string;
	// Fixing it drops information the standard doesn't call safe to drop.
	lossy?: boolean;
	find(data: Data): Occurrence[];
	// Mutates `data`; returns false when it needs a manual change.
	fix?(data: Data, ctx: UpgradeContext): boolean;
}

const DROP = "This key is DEPRECATED and will be removed in the future. It's safe to drop it";
const deprecatedKey = (hint: string) =>
	`This key is DEPRECATED and will be removed in the future. ${hint}`;

const keysAt = (path: string) => (data: Data) =>
	find(data, path).map(({ key }) => ({ key }));

const dropAll = (path: string) => (data: Data) => {
	for (const { key } of find(data, path).reverse()) remove(data, key);
	return true;
};

// A key deprecated with nothing to migrate it to.
const dropKey = (
	id: string,
	since: string,
	path: string,
	options: Partial<Deprecation> = {},
): Deprecation => ({
	id,
	since,
	message: DROP,
	find: keysAt(path),
	fix: dropAll(path),
	...options,
});

const lowercaseCountries = (path: string) => (data: Data) => {
	const list = get(data, path);
	if (!Array.isArray(list)) return [];

	return list.flatMap((c, i) =>
		typeof c === "string" && /^[a-z]{2}$/.test(c)
			? [{ key: `${path}[${i}]`, params: { value: c.toUpperCase() } }]
			: [],
	);
};

const upperCountries = (path: string) => (data: Data) => {
	const list = get(data, path);
	if (!Array.isArray(list)) return true;

	const parent = get(data, path.split(".").slice(0, -1).join(".")) as Data;
	const prop = path.slice(path.lastIndexOf(".") + 1);
	parent[prop] = list.map((c) =>
		typeof c === "string" && /^[a-z]{2}$/.test(c) ? c.toUpperCase() : c,
	);
	return true;
};

// Core deprecations, in the order an upgrade applies them.
export const coreDeprecations: Deprecation[] = [
	dropKey("genericName", "0.3.0", "description.*.genericName", { parser: true }),
	{
		id: "monochromeLogo",
		since: "0.3.0",
		message: deprecatedKey("Use 'logo' instead"),
		parser: true,
		find: keysAt("monochromeLogo"),
		fix(data) {
			if (typeof data.monochromeLogo === "string" && !data.logo) {
				data.logo = data.monochromeLogo;
			}
			delete data.monochromeLogo;
			return true;
		},
	},
	dropKey("inputTypes", "0.3.0", "inputTypes", { parser: true }),
	dropKey("outputTypes", "0.3.0", "outputTypes", { parser: true }),
	dropKey("authorsFile", "0.4.0", "legal.authorsFile", { parser: true }),
	{
		id: "lowercaseCountries",
		since: "0.5.0",
		message: "Lowercase country codes are DEPRECATED. Use uppercase instead ('{value}')",
		parser: true,
		find: (data) => [
			...lowercaseCountries("intendedAudience.countries")(data),
			...lowercaseCountries("intendedAudience.unsupportedCountries")(data),
		],
		fix: (data) =>
			upperCountries("intendedAudience.countries")(data) &&
			upperCountries("intendedAudience.unsupportedCountries")(data),
	},
	{
		id: "repoOwner",
		since: "0.5.0",
		message: deprecatedKey("Use 'organisation.name' instead"),
		parser: true,
		find: keysAt("legal.repoOwner"),
		fix(data) {
			const legal = data.legal as Data;
			// organisation needs a uri: without one, it's up to the user.
			if (!isObject(data.organisation)) return false;

			data.organisation.name ??= legal.repoOwner;
			delete legal.repoOwner;
			return true;
		},
	},
	{
		id: "isBasedOnString",
		since: "0.8.0",
		message: "The single string form of this key is DEPRECATED. Use a one element array instead",
		find: (data) =>
			typeof data.isBasedOn === "string" ? [{ key: "isBasedOn" }] : [],
		fix(data) {
			data.isBasedOn = [data.isBasedOn];
			return true;
		},
	},
	{
		id: "usedBy",
		since: "0.8.0",
		message: deprecatedKey("It will be removed"),
		lossy: true,
		find: keysAt("usedBy"),
		fix: dropAll("usedBy"),
	},
	{
		id: "videos",
		since: "0.8.0",
		message: deprecatedKey(
			"Link videos from the documentation or the website of the software instead",
		),
		lossy: true,
		find: keysAt("description.*.videos"),
		fix: dropAll("description.*.videos"),
	},
	{
		id: "unsupportedCountries",
		since: "0.8.0",
		message: deprecatedKey(
			"Use 'intendedAudience.countries' to list the countries the software targets instead",
		),
		lossy: true,
		find: keysAt("intendedAudience.unsupportedCountries"),
		fix: dropAll("intendedAudience.unsupportedCountries"),
	},
	{
		id: "governmentScope",
		since: "0.8.0",
		message: "The 'government' scope is DEPRECATED and will be removed in the future",
		lossy: true,
		find(data) {
			const scope = get(data, "intendedAudience.scope");
			if (!Array.isArray(scope)) return [];

			return scope.flatMap((s, i) =>
				s === "government" ? [{ key: `intendedAudience.scope[${i}]` }] : [],
			);
		},
		fix(data) {
			const audience = data.intendedAudience as Data;
			audience.scope = (audience.scope as unknown[]).filter(
				(s) => s !== "government",
			);
			if ((audience.scope as unknown[]).length === 0) {
				remove(data, "intendedAudience.scope");
			}
			return true;
		},
	},
	{
		id: "dependsOnOpen",
		since: "0.8.0",
		message: deprecatedKey(
			"Open source runtime dependencies are already declared in the SBOM or in the package manager manifests",
		),
		lossy: true,
		find: keysAt("dependsOn.open"),
		fix: dropAll("dependsOn.open"),
	},
];

export const formatMessage = (message: string, params?: Record<string, string>) =>
	message.replace(/\{(\w+)\}/g, (m, name) => params?.[name] ?? m);
