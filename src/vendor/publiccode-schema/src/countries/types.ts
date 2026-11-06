import type { Deprecation } from "../lib/deprecations";
import type { FieldHistory } from "../lib/history";
import type { UiOverlay } from "../lib/form";

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

export interface CountryExtension {
	// ISO 3166-1 alpha-2, uppercase: the section key in publiccode.yml.
	code: string;
	// "standard": the section is defined by the publiccode.yml standard and
	// accepted by the parser. "experimental": the parser rejects the section
	// as an unknown key, so it's only added to schemas on request.
	status: "standard" | "experimental";
	section?: {
		// JSON Schema of the section, without $id.
		schema: JSONSchema;
		since?: string;
		// Also accept the lowercase key, deprecated since 0.5.0 (before it was
		// the only form).
		lowercaseKey?: boolean;
		deprecated?: { since: string; hint: string };
	};
	// Paths start with the section code, e.g. "IT.piattaforme.io".
	fieldHistory?: FieldHistory[];
	// Standards and platforms of the country, shown as `supports` choices.
	supports?: SupportsPreset[];
	// Run by an upgrade after the core ones, in order.
	deprecations?: Deprecation[];
	ui?: UiOverlay;
	// By language; at least "en".
	locales: Record<string, LocaleBundle>;
}
