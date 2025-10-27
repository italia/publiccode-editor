import { ENDPOINTS } from "./oembed-provider-importer";

function matchesSchemas(url: string, schemas: string[]): boolean {
  return schemas.some((schema) => {
    const regex = new RegExp("^" + schema.replace(/\*/g, ".*") + "$");
    return regex.test(url);
  });
}

function findOEmbedEndpointUrlByReqUrl(reqUrl: string): string | undefined {
  for (const endpoint of ENDPOINTS) {
    if (endpoint.schemes?.some((scheme) => matchesSchemas(reqUrl, [scheme]))) {
      return endpoint.url;
    }
  }

  return undefined;
}

export { findOEmbedEndpointUrlByReqUrl };
