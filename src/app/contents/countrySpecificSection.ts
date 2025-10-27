import { CountrySection } from "../lib/store";

const SECTIONS = ["none", "all", "italy"] as CountrySection[];

export const parse = (input: string): CountrySection[] => {
  const splitted = input?.split(",")?.map((s) => s.trim());

  const sections: CountrySection[] = [];
  splitted.forEach((s) => {
    if (!SECTIONS.includes(s as CountrySection)) {
      console.warn(`Unknown Country specific section: ${s}`);
      return;
    }

    sections.push(s as CountrySection);
  });

  return sections;
};

export const isVisible = (
  config: CountrySection[],
  country: CountrySection,
): boolean => {
  if (config.includes("all")) return true;
  if (config.includes("none")) return false;

  return config.includes(country);
};
