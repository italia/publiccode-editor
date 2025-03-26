import linter from "../linter";
import YAML from "yaml";
import PublicCode from "../contents/publiccode";
import { useEffect } from "react";
import { useState } from "react";

export function getYaml(data: PublicCode): string | null {
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