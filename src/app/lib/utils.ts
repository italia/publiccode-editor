import { useEffect, useState } from "react";
import YAML from "yaml";
import PublicCode from "../contents/publiccode";
import linter from "../linter";

/**
 * Converts country codes in intendedAudience to uppercase (ISO 3166-1 alpha-2 standard)
 */
function convertCountriesToUppercase(
  intendedAudience?: PublicCode["intendedAudience"]
): PublicCode["intendedAudience"] {
  if (!intendedAudience) {
    return intendedAudience;
  }

  const converted = { ...intendedAudience };

  if (Array.isArray(converted.countries)) {
    converted.countries = converted.countries.map((code) =>
      typeof code === "string" ? code.toUpperCase() : code
    );
  }

  if (Array.isArray(converted.unsupportedCountries)) {
    converted.unsupportedCountries = converted.unsupportedCountries.map(
      (code) => (typeof code === "string" ? code.toUpperCase() : code)
    );
  }

  return converted;
}

/**
 * Converts the data object to use uppercase country section keys (e.g., "it" -> "IT")
 * and uppercase country codes in intendedAudience
 */
function convertForYamlOutput(data: PublicCode): Record<string, unknown> {
  const linted = linter(data);
  const converted: Record<string, unknown> = { ...linted };

  if ("it" in converted && converted.it) {
    converted.IT = converted.it;
    delete converted.it;
  }

  if (linted.intendedAudience) {
    converted.intendedAudience = convertCountriesToUppercase(
      linted.intendedAudience
    );
  }

  return converted;
}

/**
 * Converts uppercase country section keys back to lowercase for internal use
 * (e.g., "IT" -> "it") and converts country codes to uppercase for consistency
 */
function convertFromYamlInput(parsed: unknown): PublicCode {
  const data = parsed as Record<string, unknown>;

  if (data.IT && !data.it) {
    data.it = data.IT;
    delete data.IT;
  }

  if (data.intendedAudience && typeof data.intendedAudience === "object") {
    const audience = data.intendedAudience as {
      countries?: unknown[];
      unsupportedCountries?: unknown[];
      scope?: unknown;
    };

    if (Array.isArray(audience.countries)) {
      audience.countries = audience.countries.map((code) =>
        typeof code === "string" ? code.toUpperCase() : code
      );
    }

    if (Array.isArray(audience.unsupportedCountries)) {
      audience.unsupportedCountries = audience.unsupportedCountries.map(
        (code) => (typeof code === "string" ? code.toUpperCase() : code)
      );
    }
  }

  return data as unknown as PublicCode;
}

export function parseYaml(yaml: string): PublicCode | null {
  if (!yaml) {
    return null;
  }
  const parsed = YAML.parse(yaml);
  // Note: we are converting the yaml input to the internal use format (IT -> it)
  return convertFromYamlInput(parsed);
}

export function getYaml(data: PublicCode): string | null {
  console.log("getYaml", data);
  if (!data) {
    return null;
  }
  const converted = convertForYamlOutput(data);
  return YAML.stringify(converted) as string;
}

export function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}

export function collectRemovedKeys(
  original: unknown,
  sanitized: unknown,
  prefix = ""
): Array<string> {
  const removed: Array<string> = [];

  if (original && typeof original === "object" && !Array.isArray(original)) {
    const originalObj = original as Record<string, unknown>;
    const sanitizedObj =
      sanitized && typeof sanitized === "object" && !Array.isArray(sanitized)
        ? (sanitized as Record<string, unknown>)
        : {};

    for (const key of Object.keys(originalObj)) {
      const nextPrefix = prefix ? `${prefix}.${key}` : key;
      if (
        !(key in sanitizedObj) ||
        (sanitizedObj as Record<string, unknown>)[key] === undefined
      ) {
        removed.push(nextPrefix);
      } else {
        removed.push(
          ...collectRemovedKeys(
            (originalObj as Record<string, unknown>)[key],
            (sanitizedObj as Record<string, unknown>)[key],
            nextPrefix
          )
        );
      }
    }
  }

  return removed;
}
