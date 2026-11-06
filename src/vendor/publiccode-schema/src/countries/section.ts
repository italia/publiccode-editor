import type { Deprecation } from "../lib/deprecations";
import { type Data, isObject } from "../lib/paths";
import type { CountryExtension, CountrySection } from "./types";

// A section in a file, under its key or (for IT) its lowercase key.
export function sectionOf(
	data: Data,
	key: string,
): { key: string; value: Data } | undefined {
	for (const k of [key, key.toLowerCase()]) {
		const value = data[k];
		if (isObject(value)) return { key: k, value };
	}
	return undefined;
}

function rulesFor(country: CountryExtension, section: CountrySection) {
	const { key } = section;
	const lower = key.toLowerCase();
	const first: Deprecation[] = [];
	const last: Deprecation[] = [];

	if (section.lowercaseKey && lower !== key) {
		first.push({
			id: "lowercaseSection",
			since: "0.5.0",
			message: `Lowercase country codes are DEPRECATED and will be removed in the future. Use '${key}' instead`,
			parser: true,
			country: country.id,
			find: (data) => (lower in data ? [{ key: lower, params: { value: key } }] : []),
			fix(data) {
				// Both keys is a parser error, not something to merge.
				if (key in data) return false;

				data[key] = data[lower];
				delete data[lower];
				return true;
			},
		});
	}

	const { deprecated } = section;
	if (deprecated) {
		last.push({
			id: "countrySection",
			since: deprecated.since,
			message: `This section is DEPRECATED and will be removed in the future. ${deprecated.hint}`,
			country: country.id,
			find: (data) => {
				const s = sectionOf(data, key);
				return s ? [{ key: s.key, params: { value: key } }] : [];
			},
			fix(data) {
				const s = sectionOf(data, key);
				if (!s) return true;

				// Whatever the country rules couldn't migrate is left to the user.
				const rest = Object.keys(s.value).filter((k) => k !== "countryExtensionVersion");
				if (rest.length > 0) return false;

				delete data[s.key];
				return true;
			},
		});
	}

	return { first, last };
}

// Rules every section gets from its declaration: they run before (`first`)
// and after (`last`) the core and country deprecations.
export function sectionDeprecations(country: CountryExtension) {
	const rules = (country.sections ?? []).map((s) => rulesFor(country, s));

	return {
		first: rules.flatMap((r) => r.first),
		last: rules.flatMap((r) => r.last),
	};
}
