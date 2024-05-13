const SECTIONS = ["italy", "all", "none"] as const;
export type CountrySpecificSection = typeof SECTIONS[number];

export const parse = (input: string): CountrySpecificSection[] => {
    const splitted = input?.split(",")?.map(s => s.trim());

    const sections: CountrySpecificSection[] = [];
    splitted.forEach(s => {
        if (!SECTIONS.includes(s as CountrySpecificSection)) {
            console.warn(`Unknown Country specific section: ${s}`);
            return;
        }

        sections.push(s as CountrySpecificSection);
    });

    return sections;
}

export const isVisible = (
  config: CountrySpecificSection[],
  country: CountrySpecificSection,
): boolean => {
    if (config.includes("all")) return true;
    if (config.includes("none")) return false;

    return config.includes(country);
}
