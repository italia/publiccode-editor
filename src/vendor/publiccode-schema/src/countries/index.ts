import alpha3 from "../../data/vocab/countries-alpha3.json";
import { supportsAliases } from "../lib/vocab";
import ita from "./ita";
import type { CountryExtension } from "./types";

const ALPHA3 = alpha3 as Record<string, string>;
// Section keys the standard defines.
const STANDARD_SECTIONS = ["IT"];

// Checks a country package; throws on mistakes a schema can't catch.
export function defineCountry(country: CountryExtension): CountryExtension {
	const { id } = country;
	if (!/^[a-z]{3}$/.test(id) || !(id in ALPHA3)) {
		throw new Error(`${id}: not a lowercase ISO 3166-1 alpha-3 code`);
	}
	if (!country.locales.en) throw new Error(`${id}: missing the "en" locale`);

	const keys = (country.sections ?? []).map((s) => s.key);
	for (const s of country.sections ?? []) {
		if (s.standard && !STANDARD_SECTIONS.includes(s.key)) {
			throw new Error(`${id}: ${s.key} isn't a section of the standard`);
		}
		if (s.standard && ALPHA3[id] !== s.key) {
			throw new Error(`${id}: ${s.key} is another country's section`);
		}
		// Its own key keeps it apart from the standard's alpha-2 sections.
		if (!s.standard && s.key !== id) {
			throw new Error(`${id}: an experimental section must use the key "${id}"`);
		}
	}

	for (const { id: support } of country.supports ?? []) {
		// An unknown alias is a validation error: new ones go in the standard
		// first, until then use the URI of the resource.
		if (support.startsWith("alias:") && !supportsAliases.includes(support.slice(6))) {
			throw new Error(`${id}: ${support} isn't in the standard's list of aliases`);
		}
	}
	for (const { path } of country.fieldHistory ?? []) {
		if (!keys.includes(path.split(".")[0])) {
			throw new Error(`${id}: history path ${path} is outside its sections`);
		}
	}

	return country;
}

// Every country package. Standard sections go in the generated schemas;
// experimental ones only when enabled (see withCountries()).
export const countries: CountryExtension[] = [ita].map(defineCountry);

export const countryById = (id: string) => countries.find((c) => c.id === id.toLowerCase());

export type {
	CountryExtension,
	CountrySection,
	LocaleBundle,
	SectionOf,
	SupportsPreset,
} from "./types";
export { sectionsOf } from "./types";
