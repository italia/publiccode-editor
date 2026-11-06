import type { CountryExtension, JSONSchema } from "../countries/types";
import { fieldHistory } from "./history";
import { isObject } from "./paths";
import { deref } from "./schema";
import type { SchemaVersion } from "./versions";

export type Widget =
	| "text"
	| "textarea"
	| "markdown"
	| "url"
	| "email"
	| "date"
	| "select"
	| "radio"
	| "multiselect"
	| "tags"
	| "boolean"
	| "license"
	| "language"
	| "country"
	| "supports"
	| "fieldset"
	| "objects"
	| "localised"
	| "hidden";

// Presentation of a field, keyed by its path (arrays transparent, `*` for
// the language of `description`). The schema stays the only source of types,
// constraints and required keys; this only says where and how to show them.
export interface UiField {
	// Group id; inherited from the closest ancestor that has one.
	group?: string;
	order?: number;
	widget?: Widget;
	// Translation key without ".label"/".description", when it doesn't follow
	// the path (the default is "publiccodeyml.<path>").
	i18n?: string;
	// Required when another key has one of these values (if/then in the schema).
	requiredWhen?: Record<string, string[]>;
	// Items of an array the schema validates elsewhere (in an if/then).
	items?: string;
}

export type UiOverlay = Record<string, UiField>;

export interface FormGroup {
	id: string;
	// Translation key of the title.
	i18n: string;
	order: number;
	country?: string;
	// For a country group: the section key in this version ("it" before 0.5.0).
	key?: string;
}

export interface FormOption {
	value: string;
	i18n?: string;
	label?: string;
	country?: string;
}

export interface FormField {
	path: string;
	parent?: string;
	// Translation key: `${i18n}.label`, `${i18n}.description`.
	i18n: string;
	group: string;
	order: number;
	widget: Widget;
	type: string | string[];
	required: boolean;
	requiredWhen?: Record<string, string[]>;
	constraints?: Record<string, unknown>;
	options?: FormOption[];
	suggestions?: FormOption[];
	since?: string;
	deprecated?: { since: string; hint: string };
	country?: string;
	experimental?: true;
}

export interface FormSchema {
	version: SchemaVersion;
	groups: FormGroup[];
	fields: FormField[];
}

const CONSTRAINTS = [
	"minLength",
	"maxLength",
	"minItems",
	"maxItems",
	"minProperties",
	"pattern",
	"format",
	"const",
] as const;

function widgetFor(node: JSONSchema, items?: JSONSchema): Widget {
	if (node.type === "boolean") return "boolean";
	if (Array.isArray(node.enum)) return "select";
	if (node.type === "object") {
		return node.properties ? "fieldset" : "localised";
	}
	if (node.type === "array" || Array.isArray(node.type)) {
		if (items?.type === "object") return "objects";
		if (Array.isArray(items?.enum)) return "multiselect";
		if (items?.format === "bcp47_strict_language_tag") return "language";
		if (items?.format === "iso3166_1_alpha2_lower_or_upper") return "country";
		return "tags";
	}

	switch (node.format) {
		case "date":
			return "date";
		case "email":
			return "email";
		case "spdx_expression":
			return "license";
		case "url_url":
		case "url_http_url":
			return "url";
	}
	if (typeof node.maxLength === "number" && node.maxLength > 1000) return "textarea";

	return "text";
}

// "IT.riuso.codiceIPA" -> "publiccodeyml.it.riuso.codiceIPA": the editor's
// keys use the lowercase section code.
const defaultI18n = (path: string, countries: Set<string>) => {
	const [first, ...rest] = path.replace(/\.\*/g, "").split(".");
	const head = countries.has(first) ? first.toLowerCase() : first;

	return ["publiccodeyml", head, ...rest].join(".");
};

export function buildFormSchema(
	schema: JSONSchema,
	options: {
		version: SchemaVersion;
		ui: UiOverlay;
		groups: FormGroup[];
		countries?: CountryExtension[];
		supports?: FormOption[];
	},
): FormSchema {
	const countries = options.countries ?? [];
	const codes = new Set(countries.map((c) => c.code));
	const ui: UiOverlay = Object.assign({}, options.ui, ...countries.map((c) => c.ui ?? {}));
	const history = new Map(
		[...fieldHistory, ...countries.flatMap((c) => c.fieldHistory ?? [])].map((h) => [h.path, h]),
	);
	const groups = [...options.groups];
	const fields: FormField[] = [];

	for (const c of countries) {
		if (!c.section) continue;
		groups.push({
			id: `country:${c.code}`,
			i18n: `countries.${c.code}.name`,
			order: groups.length + 1,
			country: c.code,
		});
	}

	const sortedEntries = (props: Record<string, JSONSchema>, base: string, groupOf: (prop: string) => string) => {
		const groupOrder = (id: string) => groups.find((g) => g.id === id)?.order ?? 999;
		return Object.entries(props)
			.map(([prop, node], index) => {
				const path = base ? `${base}.${prop}` : prop;
				return { prop, node, path, rank: ui[path]?.order ?? 1000 + index, group: groupOf(prop) };
			})
			.sort((a, b) => groupOrder(a.group) - groupOrder(b.group) || a.rank - b.rank);
	};

	const walk = (
		node: JSONSchema,
		path: string,
		ctx: { parent?: string; group: string; required: boolean; country?: string },
	) => {
		const own = ui[path] ?? {};
		const resolved = deref(schema, node);
		const itemsNode = own.items ? { $ref: own.items } : resolved.items;
		const items = isObject(itemsNode) ? deref(schema, itemsNode) : undefined;
		const group = ctx.group;
		const h = history.get(path);
		const { country } = ctx;
		const ext = countries.find((c) => c.code === country);

		const field: FormField = {
			path,
			parent: ctx.parent,
			i18n: own.i18n ?? defaultI18n(path, codes),
			group,
			order: fields.length,
			widget: own.widget ?? widgetFor(resolved, items),
			type: (resolved.type ?? "string") as string | string[],
			required: ctx.required,
		};
		if (own.requiredWhen) field.requiredWhen = own.requiredWhen;

		const constraints: Record<string, unknown> = {};
		for (const k of CONSTRAINTS) {
			if (resolved[k] !== undefined) constraints[k] = resolved[k];
			if (items?.[k] !== undefined) constraints[`items.${k}`] = items[k];
		}
		if (Object.keys(constraints).length > 0) field.constraints = constraints;

		const values = (resolved.enum ?? items?.enum) as string[] | undefined;
		if (values) field.options = values.map((value) => ({ value }));
		const examples = (resolved.examples ?? items?.examples) as string[] | undefined;
		if (examples) field.suggestions = examples.map((value) => ({ value }));

		if (h?.since) field.since = h.since;
		// The strict schema only marks what's deprecated in its version.
		if (node.deprecated || resolved.deprecated) {
			const section = path === country ? ext?.section?.deprecated : undefined;
			field.deprecated = h?.deprecated ?? section ?? { since: "", hint: "" };
		}
		if (country) field.country = country;
		if (ext?.status === "experimental") field.experimental = true;

		fields.push(field);

		// Children: object properties, array items, map values.
		let container: JSONSchema | undefined;
		let base = path;
		if (resolved.type === "object" && resolved.properties) container = resolved;
		else if (items?.type === "object" && items.properties) container = items;
		else if (resolved.type === "object" && isObject(resolved.additionalProperties)) {
			container = deref(schema, resolved.additionalProperties);
			base = `${path}.*`;
		}
		if (!container?.properties) return;

		const required = (container.required ?? []) as string[];
		const children = sortedEntries(container.properties as Record<string, JSONSchema>, base, () => group);
		for (const child of children) {
			walk(child.node, child.path, {
				parent: path,
				group: ui[child.path]?.group ?? group,
				required: required.includes(child.prop),
				country,
			});
		}
	};

	const rootRequired = (schema.required ?? []) as string[];
	const rootProps = schema.properties as Record<string, JSONSchema>;
	// The section key a country uses in this version ("it" before 0.5.0).
	const sectionKeys: Record<string, string> = {};
	const canonical: Record<string, JSONSchema> = {};
	for (const [prop, node] of Object.entries(rootProps)) {
		const code = prop.toUpperCase();
		if (!codes.has(code)) {
			canonical[prop] = node;
		} else if (!(code in canonical) || prop === code) {
			// The lowercase key is the same section: the form shows it once.
			canonical[code] = node;
			sectionKeys[code] = prop;
		}
	}
	const groupOf = (prop: string) =>
		codes.has(prop) ? `country:${prop}` : (ui[prop]?.group ?? "other");

	for (const entry of sortedEntries(canonical, "", groupOf)) {
		const isCountry = codes.has(entry.prop);
		walk(entry.node, entry.prop, {
			group: entry.group,
			required: rootRequired.includes(sectionKeys[entry.prop] ?? entry.prop),
			country: isCountry ? entry.prop : undefined,
		});
	}
	for (const g of groups) {
		if (g.country && sectionKeys[g.country]) g.key = sectionKeys[g.country];
	}

	// supports: the core aliases plus the presets of each country.
	const supports = fields.find((f) => f.path === "supports.id");
	if (supports && options.supports) {
		supports.suggestions = [
			...options.supports,
			...countries.flatMap((c) =>
				(c.supports ?? []).map((p) => ({
					value: p.id,
					label: p.label,
					country: c.code,
				})),
			),
		];
	}

	return { version: options.version, groups, fields };
}
