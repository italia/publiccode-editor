import { create } from "zustand";
import { Warning } from "../components/WarningBox";
import {
  DEFAULT_COUNTRY_SECTIONS,
  FALLBACK_LANGUAGE,
} from "../contents/constants";
import { persist } from "zustand/middleware";

export type CountrySection = "none" | "all" | "italy";

type QueryParamsStore = {
  setQueryParam: (key: string, value: string | null) => void;
  getQueryParam: (key: string) => string | null;
  removeQueryParam: (key: string) => void;
};

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

type CountryStore = {
  countrySections: CountrySection[];
  setCountrySections: (value: CountrySection[]) => void;
  resetCountrySections: () => void;
};

export const useQueryParamsStore = create<QueryParamsStore>(() => ({
  setQueryParam: (key: string, value: string | null) => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);

    if (value === null) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }

    window.history.replaceState({}, "", url.toString());
  },

  getQueryParam: (key: string) => {
    if (typeof window === "undefined") return null;

    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key);
  },

  removeQueryParam: (key: string) => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    url.searchParams.delete(key);
    window.history.replaceState({}, "", url.toString());
  },
}));

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

const initializeCountrySections = (): CountrySection[] => {
  if (typeof window !== "undefined") {
    const queryParamsStore = useQueryParamsStore.getState();
    const countryParam = queryParamsStore.getQueryParam("countrySpecific");

    if (countryParam === "all" || countryParam === "italy") {
      return [countryParam];
    } else {
      return DEFAULT_COUNTRY_SECTIONS.split(",") as (
        | "none"
        | "all"
        | "italy"
      )[];
    }
  }

  return DEFAULT_COUNTRY_SECTIONS.split(",") as CountrySection[];
};

export const useCountryStore = create<CountryStore>()((set) => {
  const queryParamsStore = useQueryParamsStore.getState();

  return {
    countrySections: initializeCountrySections(),
    setCountrySections: (value: CountrySection[]) => {
      set(() => ({ countrySections: value }));

      const currentValue = value[0] || "none";

      if (currentValue === "none") {
        queryParamsStore.removeQueryParam("countrySpecific");
      } else {
        queryParamsStore.setQueryParam("countrySpecific", currentValue);
      }
    },
    resetCountrySections: () => {
      const defaultSections = DEFAULT_COUNTRY_SECTIONS.split(
        ","
      ) as CountrySection[];

      set(() => ({
        countrySections: defaultSections,
      }));

      const currentValue = defaultSections[0] || "none";

      if (currentValue === "none") {
        queryParamsStore.removeQueryParam("countrySpecific");
      } else {
        queryParamsStore.setQueryParam("countrySpecific", currentValue);
      }
    },
  };
});
