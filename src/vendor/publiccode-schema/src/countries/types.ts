import type { Deprecation } from "../lib/deprecations";
import type { UiOverlay } from "../lib/form";
import type { FieldHistory } from "../lib/history";

export type JSONSchema = Record<string, unknown>;

// Nested translations, merged into the editor's i18next resources.
export type LocaleBundle = { [key: string]: string | LocaleBundle };

export interface SupportsPreset {
	// The `supports[].id` value: `alias:<name>` (must be in the standard's
	// list of aliases) or any URI.
	id: string;
	// A proper name (SPID, DigiD...), shown as is.
	label: string;
}

export interface CountrySection {
	// The key in publiccode.yml: the uppercase alpha-2 code for the section
	// the standard defines (IT), the package id (e.g. "nld") for one of the
	// package's own.
	key: string;
	// Defined by the publiccode.yml standard (only IT is) and accepted by the
	// parser. Other sections are experimental: the parser rejects them as
	// unknown keys, so they're only in a schema when enabled.
	standard: boolean;
	// JSON Schema of the section, without $id.
	schema: JSONSchema;
	since?: string;
	// Also accept the lowercase key, deprecated since 0.5.0 (before it was the
	// only form). Only for standard sections.
	lowercaseKey?: boolean;
	deprecated?: { since: string; hint: string };
}

export interface CountryExtension {
	// ISO 3166-1 alpha-3, lowercase ("ita", "nld"): it never collides with
	// the alpha-2 section keys of the standard.
	id: string;
	sections?: CountrySection[];
	// Paths start with a section key, e.g. "IT.piattaforme.io".
	fieldHistory?: FieldHistory[];
	// Standards and platforms of the country, shown as `supports` choices.
	supports?: SupportsPreset[];
	// Run by an upgrade after the core ones, in order.
	deprecations?: Deprecation[];
	ui?: UiOverlay;
	// By language; at least "en". Keys: countries.<id>.name for the title,
	// publiccodeyml.<section key, lowercase>.<path> for the fields.
	locales: Record<string, LocaleBundle>;
}

// A section with the package it belongs to.
export interface SectionOf {
	country: CountryExtension;
	section: CountrySection;
}

// The sections of these packages that go in a schema: the standard ones,
// plus the experimental ones of the packages in `experimental` (ids).
export function sectionsOf(
	countries: CountryExtension[],
	experimental: string[] = [],
): SectionOf[] {
	return countries.flatMap((country) =>
		(country.sections ?? [])
			.filter((s) => s.standard || experimental.includes(country.id))
			.map((section) => ({ country, section })),
	);
}
