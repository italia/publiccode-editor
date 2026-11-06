import countryCodes from "../../data/vocab/countries.json";
import { supportsAliases } from "../lib/vocab";
import IT from "./IT";
import type { CountryExtension } from "./types";

// Checks a country package; throws on mistakes a schema can't catch.
export function defineCountry(country: CountryExtension): CountryExtension {
	const { code } = country;
	if (!/^[A-Z]{2}$/.test(code) || !countryCodes.includes(code)) {
		throw new Error(`${code}: not an uppercase ISO 3166-1 alpha-2 code`);
	}
	if (!country.locales.en) throw new Error(`${code}: missing the "en" locale`);

	for (const { id } of country.supports ?? []) {
		// An unknown alias is a validation error: new ones go in the standard
		// first, until then use the URI of the resource.
		if (id.startsWith("alias:") && !supportsAliases.includes(id.slice(6))) {
			throw new Error(`${code}: ${id} isn't in the standard's list of aliases`);
		}
	}
	for (const { path } of country.fieldHistory ?? []) {
		if (path.split(".")[0] !== code) {
			throw new Error(`${code}: history path ${path} is outside the section`);
		}
	}

	return country;
}

// Every country package. "standard" ones go in the generated schemas;
// "experimental" ones only when asked for (see withCountries()).
export const countries: CountryExtension[] = [IT].map(defineCountry);

export const standardCountries = () => countries.filter((c) => c.status === "standard");

export const countryByCode = (code: string) =>
	countries.find((c) => c.code === code.toUpperCase());

export type { CountryExtension, LocaleBundle, SupportsPreset } from "./types";
