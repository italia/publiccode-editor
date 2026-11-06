// Runtime library: versions, deprecations and upgrades, country packages, and
// the builders the generator uses. It doesn't depend on fluent-json-schema:
// the schemas themselves are the generated files in data/.
import { countries as allCountries } from "./countries";
import type { CountryExtension, LocaleBundle } from "./countries/types";
import { isObject } from "./lib/paths";

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
