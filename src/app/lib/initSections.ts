// Enables the experimental country sections from the environment and sets the
// latest publiccode.yml version for the validator in use (0.8.0 with Ajv).
// Imported first by main.tsx: the stores read the enabled packages when
// they're created (e.g. the countrySpecific query parameter), and the editor's
// defaults read the version when its module loads.
import { EXPERIMENTAL_SECTIONS, VALIDATOR } from "../contents/constants";
import { setLatestVersionFor } from "../contents/latestVersion";
import {
  resolveExperimentalPackages,
  setExperimentalPackages,
} from "./sections";

setLatestVersionFor(VALIDATOR);

setExperimentalPackages(
  resolveExperimentalPackages(EXPERIMENTAL_SECTIONS.split(","), VALIDATOR),
);
