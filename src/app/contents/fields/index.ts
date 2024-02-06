import it from "./it";
import getFields from "./generic";

const sections = [
  "name",
  "repository-and-documentation",
  "software-details",
  "legal-and-reuse",
  "description-and-features",
  "logo-and-screenshots",
  "purpose-and-audience",
  "maintenance",
];

const groups = [
  "summary",
  "maintenance",
  "legal",
  "intendedAudience",
  "localisation",
];

const countrySpec = [
  {
    code: "it",
    name: "italia",
    fields: it,
  },
];
const available_countries = countrySpec.map((country) => country.code);
export default {
  countrySpec,
  sections,
  groups,
  available_countries,
};

export const fieldsAsync = () => {
  return getFields();
};
