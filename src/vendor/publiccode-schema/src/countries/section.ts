import type { Deprecation } from "../lib/deprecations";
import { type Data, isObject } from "../lib/paths";
import type { CountryExtension } from "./types";

// The section of a country in a file, under its uppercase or lowercase key.
export function sectionOf(data: Data, code: string): { key: string; value: Data } | undefined {
	for (const key of [code, code.toLowerCase()]) {
		const value = data[key];
		if (isObject(value)) return { key, value };
	}
	return undefined;
}

// Rules every country section gets, from its declaration: they run before
// (`first`) and after (`last`) the core and country deprecations.
export function sectionDeprecations(country: CountryExtension) {
	const { code, section } = country;
	const lower = code.toLowerCase();
	const first: Deprecation[] = [];
	const last: Deprecation[] = [];
	if (!section) return { first, last };

	if (section.lowercaseKey) {
		first.push({
			id: "lowercaseSection",
			since: "0.5.0",
			message: `Lowercase country codes are DEPRECATED and will be removed in the future. Use '${code}' instead`,
			parser: true,
			country: code,
			find: (data) => (lower in data ? [{ key: lower, params: { value: code } }] : []),
			fix(data) {
				// Both keys is a parser error, not something to merge.
				if (code in data) return false;

				data[code] = data[lower];
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
			country: code,
			find: (data) => {
				const s = sectionOf(data, code);
				return s ? [{ key: s.key, params: { value: code } }] : [];
			},
			fix(data) {
				const s = sectionOf(data, code);
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
