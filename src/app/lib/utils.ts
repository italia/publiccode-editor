import linter from "../linter";
import YAML from "yaml";
import PublicCode from "../contents/publiccode";

export function getYaml(data: PublicCode): string | null {
  return data ? (YAML.stringify(linter(data)) as string) : null;
}
