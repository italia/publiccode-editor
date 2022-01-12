



export function getBrowserDefaultCountryCode(supportedCountryCodes, fallbackCountryCode){

	const iso2LanguageLike = navigator.language.split("-")[0].toLowerCase();

    const lng = supportedCountryCodes.find(lng =>
        lng.toLowerCase().includes(iso2LanguageLike)
    );

    if (lng !== undefined) {
        return lng;
    }

	return fallbackCountryCode;

}