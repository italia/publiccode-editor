// Enables the experimental country sections from the environment. Imported
// first by main.tsx: the stores read the enabled packages when they're
// created (e.g. the countrySpecific query parameter).
import { EXPERIMENTAL_SECTIONS, VALIDATOR } from "../contents/constants";
import {
  resolveExperimentalPackages,
  setExperimentalPackages,
} from "./sections";

setExperimentalPackages(
  resolveExperimentalPackages(EXPERIMENTAL_SECTIONS.split(","), VALIDATOR),
);
