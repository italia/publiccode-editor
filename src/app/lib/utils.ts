import { useEffect, useState } from "react";
import YAML from "yaml";
import PublicCode from "../contents/publiccode";
import linter from "../linter";

export function parseYaml(yaml: string): PublicCode | null {
  return yaml ? (YAML.parse(yaml) as PublicCode) : null;
}

export function getYaml(data: PublicCode): string | null {
  console.log("getYaml", data);
  return data ? (YAML.stringify(linter(data)) as string) : null;
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

export function collectRemovedKeys(original: unknown, sanitized: unknown, prefix = ""): Array<string> {
  const removed: Array<string> = [];

  if (original && typeof original === "object" && !Array.isArray(original)) {
    const originalObj = original as Record<string, unknown>;
    const sanitizedObj = (sanitized && typeof sanitized === "object" && !Array.isArray(sanitized))
      ? (sanitized as Record<string, unknown>)
      : {};

    for (const key of Object.keys(originalObj)) {
      const nextPrefix = prefix ? `${prefix}.${key}` : key;
      if (!(key in sanitizedObj) || (sanitizedObj as Record<string, unknown>)[key] === undefined) {
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