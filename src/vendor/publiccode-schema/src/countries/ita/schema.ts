import type { JSONSchema } from "../types";

// docs/standard/schema.it.rst in publiccode.yml; the parser accepts "0.2" too.
export const schema: JSONSchema = {
	title: "Italy Extension",
	description: "Schema for the Italy country extension",
	additionalProperties: false,
	properties: {
		countryExtensionVersion: {
			type: "string",
			enum: ["0.2", "1.0"],
			description:
				"This key specifies the version to which the current extension schema adheres to, for forward compatibility.\n\nPlease note how the value of this key is independent from the top-level publiccodeYmlVersion one (see The Standard (core)). In such a way, the extensions schema versioning is independent both from the core version of the schema and from every other Country.",
		},
		conforme: {
			type: "object",
			additionalProperties: false,
			description:
				"This section contains the keys for auto-declaring the compliance with the current legislation, with respect to the following sections. Not including these keys implies that the compliance is not known or not declared.",
			properties: {
				lineeGuidaDesign: {
					type: "boolean",
					description:
						"If present and set to true, the software is compliant with the Italian accessibility laws (L. 4/2004), as further explained in the linee guida di design (Italian language).",
				},
				modelloInteroperabilita: {
					type: "boolean",
					description:
						"If present and set to true, the software is compliant with the linee guida sull'interoperabilità.\n\nRegulatory reference: Art. 73 del CAD (Italian language).",
				},
				misureMinimeSicurezza: {
					type: "boolean",
					description:
						"If present and set to true, the software is compliant with the Misure minime di sicurezza ICT per le Pubbliche amministrazioni (Italian language).",
				},
				gdpr: {
					type: "boolean",
					description: "If present and set to true, the software respects the GDPR.",
				},
			},
		},
		piattaforme: {
			type: "object",
			additionalProperties: false,
			properties: {
				spid: {
					type: "boolean",
					description:
						"If present and set to true, the software interfaces with SPID - il Sistema Pubblico di Identità Digitale.",
				},
				cie: {
					type: "boolean",
					description:
						"If present and set to true, the software interfaces with the Italian electronic ID card (Carta d'Identità Elettronica).",
				},
				anpr: {
					type: "boolean",
					description: "If present and set to true, the software interfaces with ANPR.",
				},
				pagopa: {
					type: "boolean",
					description: "If present and set to true, the software interfaces with pagoPA.",
				},
				io: {
					type: "boolean",
					description:
						"If present and set to true, the software interfaces with IO app (https://io.italia.it) ",
				},
			},
		},
		riuso: {
			type: "object",
			additionalProperties: false,
			properties: {
				codiceIPA: {
					type: "string",
					format: "italian_ipa_code",
					description:
						"This key represents the administration code inside the Public Administration index (codice IPA).",
				},
			},
		},
	},
};
