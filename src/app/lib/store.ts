import { create } from "zustand";
import { Warning } from "../components/WarningBox";
import { FALLBACK_LANGUAGE } from "../contents/constants";
import { persist } from "zustand/middleware";

type YamlStore = {
  yaml: string | undefined;
  setYaml: (data: string | undefined) => void;
  resetYaml: () => void;
};

type LanguagesStore = {
  languages: string[];
  setLanguages: (data: string[]) => void;
  resetLanguages: () => void;
};

export const useLanguagesStore = create<LanguagesStore>((set) => ({
  languages: [FALLBACK_LANGUAGE],
  setLanguages: (data: string[]) => {
    set(() => ({ languages: data }));
  },
  resetLanguages: () => {
    set(() => ({ languages: [FALLBACK_LANGUAGE] }));
  },
}));

export const useYamlStore = create<YamlStore>((set) => ({
  yaml: undefined,
  setYaml: (data: string | undefined) => {
    set(() => ({ yaml: data }));
  },
  resetYaml: () => {
    set(() => ({ yaml: undefined }));
  },
}));

type WarningStore = {
  warnings: Warning[];
  setWarnings: (data: Warning[]) => void;
  resetWarnings: () => void;
};

export const useWarningStore = create<WarningStore>()(
  persist(
    (set) => ({
      warnings: [],
      setWarnings: (data: Warning[]) => {
        set(() => ({ warnings: data }));
      },
      resetWarnings: () => {
        set(() => ({ warnings: [] }));
      },
    }),
    {
      name: "warnings-storage",
    }
  )
);
