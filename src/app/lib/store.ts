import { create } from "zustand";
import { Warning } from "../components/WarningBox";
import { FALLBACK_LANGUAGE } from "../contents/constants";
import { persist } from "zustand/middleware";

type YamlStore = {
  yaml: string | undefined;
  isPublicCodeImported: boolean;
  publiccodeYmlVersion: string | undefined;
  setIsPublicCodeImported: (value: boolean) => void;
  setPubliccodeYmlVersion: (data: string | undefined) => void;
  setYaml: (data: string | undefined) => void;
  resetYaml: () => void;
};

type LanguagesStore = {
  languages: string[];
  setLanguages: (data: string[]) => void;
  resetLanguages: () => void;
};

type WarningStore = {
  warnings: Warning[];
  setWarnings: (data: Warning[]) => void;
  resetWarnings: () => void;
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

export const useYamlStore = create<YamlStore>()(
  persist(
    (set) => ({
      isPublicCodeImported: false,
      publiccodeYmlVersion: undefined,
      yaml: undefined,
      setYaml: (data: string | undefined) => {
        set((state) => ({ ...state, yaml: data }));
      },
      setPubliccodeYmlVersion: (data: string | undefined) => {
        set((state) => ({ ...state, publiccodeYmlVersion: data }));
      },
      setIsPublicCodeImported: (value: boolean) => {
        set((state) => ({ ...state, isPublicCodeImported: value }));
      },
      resetYaml: () => {
        set(() => ({
          yaml: undefined,
          isPublicCodeImported: false,
          publiccodeYmlVersion: undefined,
        }));
      },
    }),
    {
      name: "yaml-storage",
      partialize: (state) => ({
        publiccodeYmlVersion: state.publiccodeYmlVersion,
        isPublicCodeImported: state.isPublicCodeImported,
      }),
    }
  )
);

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

export const useStore = create(() => ({
  languagesStore: useLanguagesStore.getState(),
  yamlStore: useYamlStore.getState(),
  warningStore: useWarningStore.getState(),
  resetAll: () => {
    useLanguagesStore.getState().resetLanguages();
    useYamlStore.getState().resetYaml();
    useWarningStore.getState().resetWarnings();
  },
}));
