import { isObject } from "../../lib/paths";
import { isAtLeast } from "../../lib/versions";
import { sectionOf } from "../section";
import type { CountryExtension } from "../types";
import de from "./locales/de.json";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import it from "./locales/it.json";
import nl from "./locales/nl.json";
import { schema } from "./schema";

const PLATFORMS = ["spid", "cie", "anpr", "pagopa", "io"] as const;
const CONFORME = ["lineeGuidaDesign", "modelloInteroperabilita", "misureMinimeSicurezza", "gdpr"];

const SECTION_HINT =
	"Use 'supports' for compliance with national regulations and integration with national platforms, and 'organisation' to reference the publishing administration.";
const DROP = "This key is DEPRECATED and will be removed in the future. It's safe to drop it";

// Italy. Its `IT:` section is the only one the standard defines, deprecated
// since 0.7.0 in favour of `supports` and `organisation`.
export const ita: CountryExtension = {
	id: "ita",
	sections: [
		{
			key: "IT",
			standard: true,
			schema,
			lowercaseKey: true,
			deprecated: { since: "0.7.0", hint: SECTION_HINT },
		},
	],
	fieldHistory: [
		{ path: "IT.piattaforme.io", since: "0.3.0" },
		{
			path: "IT.countryExtensionVersion",
			deprecated: { since: "0.7.0", hint: "Deprecated together with the rest of the Italian section." },
		},
		{ path: "IT.conforme", deprecated: { since: "0.5.0", hint: "It's safe to drop it." } },
		...CONFORME.map((k) => ({
			path: `IT.conforme.${k}`,
			deprecated: {
				since: "0.5.0",
				hint: k === "gdpr" ? "Use 'supports' with 'alias:gdpr' instead." : "It's safe to drop it.",
			},
		})),
		{ path: "IT.piattaforme", deprecated: { since: "0.7.0", hint: "Use 'supports' instead." } },
		...PLATFORMS.map((k) => ({
			path: `IT.piattaforme.${k}`,
			deprecated: { since: "0.7.0", hint: `Use 'supports' with 'alias:${k}' instead.` },
		})),
		{
			path: "IT.riuso.codiceIPA",
			deprecated: {
				since: "0.5.0",
				hint: "Use 'organisation.uri' and set it to 'urn:x-italian-pa:<codiceIPA>' instead.",
			},
		},
	],
	supports: [
		{ id: "alias:spid", label: "SPID" },
		{ id: "alias:cie", label: "CIE" },
		{ id: "alias:anpr", label: "ANPR" },
		{ id: "alias:pagopa", label: "pagoPA" },
		{ id: "alias:io", label: "IO" },
	],
	deprecations: [
		{
			id: "codiceIPA",
			since: "0.5.0",
			message:
				"This key is DEPRECATED and will be removed in the future. Use 'organisation.uri' and set it to 'urn:x-italian-pa:{value}' instead",
			// The parser only warns about valid iPA codes: an invalid one is an error.
			parser: true,
			country: "ita",
			find(data) {
				const s = sectionOf(data, "IT");
				const riuso = s?.value.riuso;
				if (!isObject(riuso) || typeof riuso.codiceIPA !== "string") return [];

				return [{ key: "IT.riuso.codiceIPA", params: { value: riuso.codiceIPA } }];
			},
			fix(data) {
				const s = sectionOf(data, "IT");
				const riuso = s?.value.riuso as Record<string, unknown>;
				const code = riuso.codiceIPA as string;
				const legal = isObject(data.legal) ? data.legal : {};

				// What the parser does: organisation from codiceIPA and repoOwner.
				if (!isObject(data.organisation)) {
					data.organisation = { uri: `urn:x-italian-pa:${code}` };
					if (typeof legal.repoOwner === "string") {
						(data.organisation as Record<string, unknown>).name = legal.repoOwner;
					}
				}
				delete riuso.codiceIPA;
				if (Object.keys(riuso).length === 0) delete s?.value.riuso;
				return true;
			},
		},
		{
			id: "conforme",
			since: "0.5.0",
			message: DROP,
			parser: true,
			country: "ita",
			find(data) {
				const s = sectionOf(data, "IT");
				return s && "conforme" in s.value ? [{ key: "IT.conforme" }] : [];
			},
			fix(data, ctx) {
				const s = sectionOf(data, "IT");
				const conforme = s?.value.conforme;
				// The one key with a replacement (once `supports` exists).
				if (isObject(conforme) && conforme.gdpr === true && isAtLeast(ctx.to, "0.7.0")) {
					ctx.addSupport(data, "alias:gdpr");
				}
				delete s?.value.conforme;
				return true;
			},
		},
		{
			id: "piattaforme",
			since: "0.7.0",
			message:
				"This key is DEPRECATED and will be removed in the future. Use 'supports' with 'alias:{value}' instead",
			country: "ita",
			find(data) {
				const p = sectionOf(data, "IT")?.value.piattaforme;
				if (!isObject(p)) return [];

				return PLATFORMS.filter((k) => k in p).map((k) => ({
					key: `IT.piattaforme.${k}`,
					params: { value: k },
				}));
			},
			fix(data, ctx) {
				const s = sectionOf(data, "IT");
				const p = s?.value.piattaforme;
				if (isObject(p)) {
					for (const k of PLATFORMS) if (p[k] === true) ctx.addSupport(data, `alias:${k}`);
				}
				delete s?.value.piattaforme;
				return true;
			},
		},
	],
	ui: {
		"IT.countryExtensionVersion": { order: 1, widget: "hidden" },
		"IT.conforme": { order: 2 },
		"IT.piattaforme": { order: 3 },
		"IT.riuso": { order: 4 },
	},
	locales: { en, it, de, fr, nl },
};

export default ita;
