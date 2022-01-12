
import { translations } from "./translations";

export function createT(countryCode) {

	function t(token) {

		const translation = translations[countryCode] || translations["en"];

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