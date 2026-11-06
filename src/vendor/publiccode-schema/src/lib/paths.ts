export type Data = Record<string, unknown>;

export const isObject = (v: unknown): v is Data =>
	typeof v === "object" && v !== null && !Array.isArray(v);

export interface Match {
	// Dotted key of the occurrence, e.g. "description.en.genericName".
	key: string;
	parent: Data;
	prop: string;
	value: unknown;
}

// Every value at a dotted path; `*` matches any key of an object.
export function find(data: unknown, path: string): Match[] {
	let current: { key: string; value: unknown }[] = [{ key: "", value: data }];
	const segments = path.split(".");
	const matches: Match[] = [];

	segments.forEach((segment, i) => {
		const next: typeof current = [];
		for (const { key, value } of current) {
			if (!isObject(value)) continue;

			const props = segment === "*" ? Object.keys(value) : [segment];
			for (const prop of props) {
				if (!(prop in value) || value[prop] === undefined) continue;

				const k = key ? `${key}.${prop}` : prop;
				if (i === segments.length - 1) {
					matches.push({ key: k, parent: value, prop, value: value[prop] });
				} else {
					next.push({ key: k, value: value[prop] });
				}
			}
		}
		current = next;
	});

	return matches;
}

export const get = (data: unknown, path: string): unknown =>
	find(data, path)[0]?.value;

// Deletes `prop` from `parent`, then the parent itself if that left it empty.
export function remove(root: Data, key: string) {
	const segments = key.split(".");

	for (let n = segments.length; n > 0; n--) {
		const parent = n === 1 ? root : get(root, segments.slice(0, n - 1).join("."));
		if (!isObject(parent)) return;

		const prop = segments[n - 1];
		const value = parent[prop];
		if (n < segments.length && !(isObject(value) && Object.keys(value).length === 0)) {
			return;
		}
		delete parent[prop];
	}
}
