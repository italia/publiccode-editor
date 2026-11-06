import { sectionDeprecations } from "../countries/section";
import type { CountryExtension } from "../countries/types";
import {
	coreDeprecations,
	type Deprecation,
	formatMessage,
	type UpgradeContext,
} from "./deprecations";
import { type Data, isObject } from "./paths";
import { isAtLeast, LATEST_KNOWN, LATEST_SUPPORTED } from "./versions";

export interface Finding {
	id: string;
	key: string;
	since: string;
	message: string;
	params?: Record<string, string>;
	// The parser reports it too, with the same key.
	parser: boolean;
	country?: string;
	// upgrade() can fix it; lossy fixes drop information.
	fixable: boolean;
	lossy: boolean;
}

// Every rule, in the order an upgrade applies them.
export function rules(countries: CountryExtension[]): Deprecation[] {
	const sections = countries.map(sectionDeprecations);

	return [
		...sections.flatMap((s) => s.first),
		...coreDeprecations,
		...countries.flatMap((c) => c.deprecations ?? []),
		...sections.flatMap((s) => s.last),
	];
}

const findingsOf = (rule: Deprecation, data: Data): Finding[] =>
	rule.find(data).map(({ key, params }) => ({
		id: rule.id,
		key,
		since: rule.since,
		message: formatMessage(rule.message, params),
		...(params ? { params } : {}),
		parser: rule.parser ?? false,
		...(rule.country ? { country: rule.country } : {}),
		fixable: rule.fix !== undefined,
		lossy: rule.lossy ?? false,
	}));

// What's deprecated in a file, up to the latest version of the standard
// (`since` tells which version deprecated it).
export function deprecations(
	data: unknown,
	options: { countries?: CountryExtension[]; upTo?: string } = {},
): Finding[] {
	if (!isObject(data)) return [];
	const upTo = options.upTo ?? LATEST_KNOWN;

	return rules(options.countries ?? [])
		.filter((r) => isAtLeast(upTo, r.since))
		.flatMap((r) => findingsOf(r, data));
}

export interface UpgradeResult {
	data: Data;
	applied: Finding[];
	// Still there: no automatic fix, a lossy one not allowed, or a fix that
	// needs a manual change first.
	remaining: Finding[];
}

const addSupport = (data: Data, id: string) => {
	const list = Array.isArray(data.supports) ? data.supports : [];
	if (!list.some((s) => isObject(s) && s.id === id)) list.push({ id });
	data.supports = list;
};

// Migrates a file to a version of the standard, applying the fixes of every
// deprecation up to it. The input isn't modified.
export function upgrade(
	input: unknown,
	options: { to?: string; lossy?: boolean; countries?: CountryExtension[] } = {},
): UpgradeResult {
	const to = options.to ?? LATEST_SUPPORTED;
	const data = structuredClone(isObject(input) ? input : {}) as Data;
	const ctx: UpgradeContext = { to, addSupport };
	const applicable = rules(options.countries ?? []).filter((r) => isAtLeast(to, r.since));
	const applied: Finding[] = [];

	// Some fixes unblock others (codiceIPA creates the organisation repoOwner
	// moves into): repeat until nothing changes.
	for (let pass = 0, changed = true; changed && pass < 5; pass++) {
		changed = false;
		for (const rule of applicable) {
			const found = findingsOf(rule, data);
			if (found.length === 0 || !rule.fix) continue;
			if (rule.lossy && !options.lossy) continue;

			if (rule.fix(data, ctx)) {
				applied.push(...found);
				changed = true;
			}
		}
	}

	data.publiccodeYmlVersion = to;

	return {
		data,
		applied,
		remaining: applicable.flatMap((r) => findingsOf(r, data)),
	};
}
