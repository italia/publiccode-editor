
import { translations } from "./translations";
import { defaultCountryCode } from "../contents/fields";

export function createT(countryCode) {

	function t(token) {

		const translation = translations[countryCode] || translations[defaultCountryCode];

		if (translation === undefined) {
			return token;
		}

		const text = translation[token];

		if (text === undefined) {
			return token;
		}

		return text;

	}

	return { t };
}