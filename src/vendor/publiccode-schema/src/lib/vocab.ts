// Vocabularies the runtime library needs, kept apart from src/constants.ts
// so that importing the library doesn't pull in the license list.

export const versions = [
	"0",
	"0.2",
	"0.2.0",
	"0.2.1",
	"0.2.2",
	"0.3",
	"0.3.0",
	"0.4",
	"0.4.0",
	"0.5",
	"0.5.0",
	"0.7",
	"0.7.0",
];

// Aliases accepted by `supports[].id` (publiccode-parser-go supports_id).
export const supportsAliases = [
	"gdpr",
	"eidas",
	"nis2",
	"cra",
	"spid",
	"cie",
	"anpr",
	"pagopa",
	"io",
];
