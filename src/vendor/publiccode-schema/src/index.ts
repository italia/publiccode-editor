// Runtime library: versions, deprecations and upgrades, country packages, and
// the builders the generator uses. It doesn't depend on fluent-json-schema:
// the schemas themselves are the generated files in data/.
import { countries as allCountries } from "./countries";
import type { CountryExtension, LocaleBundle } from "./countries/types";
import { isObject } from "./lib/paths";
import type { Finding } from "./lib/upgrade";
import de from "./locales/de.json";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import it from "./locales/it.json";
import nl from "./locales/nl.json";

// The library's own translations (deprecation messages), by language.
const LOCALES: Record<string, LocaleBundle> = { en, it, de, fr, nl };

export * from "./lib/versions";
export { buildSchema, deref, locate, withCountries } from "./lib/schema";
export {
	buildFormSchema,
	sectionsFormSchema,
	type FormField,
	type FormGroup,
	type FormOption,
	type FormSchema,
	type UiField,
	type UiOverlay,
	type Widget,
} from "./lib/form";
export { deprecations, type Finding, rules, upgrade, type UpgradeResult } from "./lib/upgrade";
export type { Deprecation, Occurrence, UpgradeContext } from "./lib/deprecations";
export { fieldHistory, valueHistory, type FieldHistory, type ValueHistory } from "./lib/history";
export {
	countries,
	countryById,
	defineCountry,
	sectionsOf,
	type CountryExtension,
	type CountrySection,
	type LocaleBundle,
	type SectionOf,
	type SupportsPreset,
} from "./countries";

const merge = (into: LocaleBundle, from: LocaleBundle) => {
	for (const [k, v] of Object.entries(from)) {
		const current = into[k];
		into[k] = isObject(v) && isObject(current) ? merge({ ...current }, v) : v;
	}
	return into;
};

// The translations of the country packages for a language, falling back to
// English key by key, ready for i18next's addResourceBundle().
export function countryLocales(
	lang: string,
	countries: CountryExtension[] = allCountries,
): LocaleBundle {
	const bundle: LocaleBundle = {};
	for (const c of countries) {
		merge(bundle, c.locales.en);
		if (c.locales[lang]) merge(bundle, c.locales[lang]);
	}
	return bundle;
}

// The library's translations plus the country packages', for a language,
// falling back to English key by key.
export function locales(
	lang: string,
	countries: CountryExtension[] = allCountries,
): LocaleBundle {
	const bundle = merge({}, LOCALES.en);
	if (LOCALES[lang]) merge(bundle, LOCALES[lang]);

	return merge(bundle, countryLocales(lang, countries));
}

// The translation keys of a deprecation message, most specific first: a
// country package can word its own (countries.<id>.deprecations.<rule>).
// Messages use i18next interpolation: {{value}} for `params.value`.
export const deprecationKeys = (finding: Pick<Finding, "id" | "country">) => [
	...(finding.country ? [`countries.${finding.country}.deprecations.${finding.id}`] : []),
	`deprecations.messages.${finding.id}`,
];

// "{{message}} (deprecated since publiccode.yml {{since}})"
export const DEPRECATION_SINCE_KEY = "deprecations.since";
