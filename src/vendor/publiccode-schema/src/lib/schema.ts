import type { CountryExtension, JSONSchema } from "../countries/types";
import {
	type FieldHistory,
	fieldHistory,
	UPPERCASE_COUNTRIES_SINCE,
	valueHistory,
} from "./history";
import { isObject } from "./paths";
import {
	isAtLeast,
	LATEST_SUPPORTED,
	PARSER_VERSIONS,
	type SchemaVersion,
	schemaVersionFor,
} from "./versions";

export interface BuildOptions {
	// Omitted: the v0 schema, which validates every 0.x version like the parser
	// does. Otherwise a strict schema with the rules of that version only.
	version?: SchemaVersion;
	countries?: CountryExtension[];
}

const clone = <T>(v: T): T => structuredClone(v);

// Follows a $ref to the definition with that $id; sibling keys of the $ref
// (e.g. `deprecated`) are left out.
export function deref(root: JSONSchema, node: JSONSchema): JSONSchema {
	const ref = node.$ref;
	if (typeof ref !== "string") return node;

	const defs = (root.definitions ?? {}) as Record<string, JSONSchema>;
	const target = Object.values(defs).find((d) => d.$id === ref);
	if (!target) throw new Error(`unresolved $ref ${ref}`);

	return deref(root, target);
}

// Steps into an array's items, the way paths treat arrays as transparent.
const unwrapArray = (root: JSONSchema, node: JSONSchema) => {
	const n = deref(root, node);
	return n.type === "array" && isObject(n.items) ? deref(root, n.items) : n;
};

interface Location {
	// The object schema whose `properties` holds the key.
	owner: JSONSchema;
	prop: string;
	node: JSONSchema;
}

// Where a dotted path (see history.ts) lives in the schema.
export function locate(root: JSONSchema, path: string): Location | undefined {
	const segments = path.split(".");
	let owner = root;

	for (let i = 0; i < segments.length; i++) {
		const segment = segments[i];
		if (segment === "*") {
			if (!isObject(owner.additionalProperties)) return undefined;
			owner = deref(root, owner.additionalProperties);
			continue;
		}

		const props = owner.properties as Record<string, JSONSchema> | undefined;
		const node = props?.[segment];
		if (!node) return undefined;

		if (i === segments.length - 1) return { owner, prop: segment, node };
		owner = unwrapArray(root, node);
	}

	return undefined;
}

const addDeprecation = (node: JSONSchema, since: string, hint: string) => {
	node.deprecated = true;
	const note = `Deprecated since ${since}: ${hint}`;
	node.description = node.description ? `${node.description}\n\n${note}` : note;
};

function addCountry(schema: JSONSchema, country: CountryExtension) {
	if (!country.section) return;

	const { code } = country;
	const defs = schema.definitions as Record<string, JSONSchema>;
	const props = schema.properties as Record<string, JSONSchema>;

	defs[code] = { type: "object", $id: `#${code}`, ...clone(country.section.schema) };
	props[code] = { $ref: `#${code}` };
	if (country.section.lowercaseKey) {
		props[code.toLowerCase()] = { $ref: `#${code}`, deprecated: true };
	}
}

function applyFieldHistory(schema: JSONSchema, entry: FieldHistory, version: string) {
	// Gone already: removed by another entry for this version.
	const loc = locate(schema, entry.path);
	if (!loc) return;

	const { owner, prop } = loc;
	const required = (owner.required ?? []) as string[];

	if (entry.since && !isAtLeast(version, entry.since)) {
		delete (owner.properties as Record<string, unknown>)[prop];
		if (required.includes(prop)) owner.required = required.filter((r) => r !== prop);
		return;
	}

	if (entry.requiredBefore && !isAtLeast(version, entry.requiredBefore)) {
		if (!required.includes(prop)) owner.required = [...required, prop];
	}

	// A $ref can't be annotated in place: the annotation goes on the property.
	const node = loc.node;
	if (entry.deprecated && isAtLeast(version, entry.deprecated.since)) {
		addDeprecation(node, entry.deprecated.since, entry.deprecated.hint);
	} else if (entry.deprecated) {
		delete node.deprecated;
	}
}

// Version values a strict schema accepts: the ones that map to it.
function declaredVersions(version: SchemaVersion) {
	const accepted = PARSER_VERSIONS.filter((v) => schemaVersionFor(v) === version);
	if (accepted.length > 0) return accepted;

	// Not accepted by the parser yet, e.g. 0.8.0.
	return [version.replace(/\.0$/, ""), version];
}

export function buildSchema(base: JSONSchema, options: BuildOptions = {}): JSONSchema {
	const schema = clone(base);
	const countries = options.countries ?? [];
	for (const country of countries) addCountry(schema, country);

	const history = [
		...fieldHistory,
		...countries.flatMap((c) => (c.section ? (c.fieldHistory ?? []) : [])),
	];
	const props = schema.properties as Record<string, JSONSchema>;

	const { version } = options;
	if (!version) {
		// Annotations only: the v0 schema must accept what the parser accepts.
		for (const entry of history) {
			const loc = locate(schema, entry.path);
			if (!loc) throw new Error(`history: no key at ${entry.path}`);
			if (entry.deprecated && isAtLeast(LATEST_SUPPORTED, entry.deprecated.since)) {
				addDeprecation(loc.node, entry.deprecated.since, entry.deprecated.hint);
			}
		}
		for (const { code, section } of countries) {
			if (section?.deprecated && isAtLeast(LATEST_SUPPORTED, section.deprecated.since)) {
				addDeprecation(props[code], section.deprecated.since, section.deprecated.hint);
			}
		}
		return schema;
	}

	schema.$id = `publicode/root/v${version}`;
	schema.title = `${schema.title} v${version}`;
	props.publiccodeYmlVersion = {
		...props.publiccodeYmlVersion,
		enum: declaredVersions(version),
	};

	// Longest paths first, so removing a section doesn't hide its children.
	const sorted = [...history].sort(
		(a, b) => b.path.split(".").length - a.path.split(".").length,
	);
	for (const entry of sorted) applyFieldHistory(schema, entry, version);

	for (const { path, value, since, deprecated } of valueHistory) {
		const loc = locate(schema, path);
		if (!loc) continue;

		const node = unwrapArray(schema, loc.node);
		if (since && !isAtLeast(version, since) && Array.isArray(node.enum)) {
			node.enum = node.enum.filter((v) => v !== value);
		}
		if (deprecated && isAtLeast(version, deprecated.since)) {
			const note = `'${value}' is deprecated since ${deprecated.since}: ${deprecated.hint}`;
			loc.node.description = `${loc.node.description ?? ""}\n\n${note}`.trim();
		}
	}

	const uppercase = isAtLeast(version, UPPERCASE_COUNTRIES_SINCE);
	for (const { code, section } of countries) {
		if (!section) continue;

		if (section.since && !isAtLeast(version, section.since)) {
			delete props[code];
			delete props[code.toLowerCase()];
			continue;
		}
		if (section.lowercaseKey && !uppercase) {
			// Before 0.5.0 the lowercase key was the only one.
			delete props[code];
			props[code.toLowerCase()] = { $ref: `#${code}` };
		}
		if (section.deprecated && isAtLeast(version, section.deprecated.since)) {
			addDeprecation(props[code], section.deprecated.since, section.deprecated.hint);
		}
	}

	if (!uppercase) {
		for (const path of ["intendedAudience.countries", "intendedAudience.unsupportedCountries"]) {
			const loc = locate(schema, path);
			if (loc) unwrapArray(schema, loc.node).pattern = "^[a-z]{2}$";
		}
	}

	return schema;
}

// Adds country sections to a generated schema, e.g. experimental ones on top
// of publiccode-schema-v0.json. Sections already there are left as they are.
export function withCountries(schema: JSONSchema, countries: CountryExtension[]): JSONSchema {
	const out = clone(schema);
	const props = out.properties as Record<string, JSONSchema>;
	for (const country of countries) {
		if (!props[country.code]) addCountry(out, country);
	}
	return out;
}
