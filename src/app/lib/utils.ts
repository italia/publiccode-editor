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