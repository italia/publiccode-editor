import { create } from "zustand";

type YamlStore = {
  yaml: string;
  setYaml: (data: string) => void;
  resetYaml: () => void;
};

export const useYamlStore = create<YamlStore>((set) => ({
  yaml: "",
  setYaml: (data: string) => {
    set(() => ({ yaml: data }));
  },
  resetYaml: () => {
    set(() => ({ yaml: "" }));
  },
}));

type WarningStore = {
  warnings: string[];
  setWarnings: (data: string[]) => void;
  resetWArnings: () => void;
};

export const useWarningStore = create<WarningStore>((set) => ({
  warnings: [],
  setWarnings: (data: string[]) => {
    set(() => ({ warnings: data }));
  },
  resetWArnings: () => {
    set(() => ({ warnings: [] }));
  },
}));
