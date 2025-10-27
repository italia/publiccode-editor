interface OEmbedEndpoint {
  schemes: string[];
  url: string;
  discovery?: boolean;
  formats?: string[];
}

interface OEmbedProvider {
  provider_name: string;
  provider_url: string;
  endpoints: OEmbedEndpoint[];
}

type OEmbedProviders = OEmbedProvider[];

export type { OEmbedEndpoint, OEmbedProvider, OEmbedProviders };
