import providers from '../generated/providers-oembed.json';

interface ConsumerRequest {
    url: string;
    format?: string;
    maxwidth?: number;
    maxheight?: number;
}

interface BaseProviderResponse {
    type: 'photo' | 'video';
    version: string;
    title?: string;
    author_name?: string;
    author_url?: string;
    provider_name?: string;
    provider_url?: string;
    cache_age?: number;
    thumbnail_url?: string;
    thumbnail_width?: number;
    thumbnail_height?: number;
}

interface PhotoProviderResponse extends BaseProviderResponse {
    type: 'photo';
    url: string;
    width: number;
    height: number;
}

interface VideoProviderResponse extends BaseProviderResponse {
    type: 'video';
    html: string;
    width: number;
    height: number;
}

type ProviderResponse = PhotoProviderResponse | VideoProviderResponse;

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

function matchesSchemas(url: string, schemas: string[]): boolean {
    return schemas.some(schema => {
        const regex = new RegExp("^" + schema.replace(/\*/g, ".*") + "$");
        return regex.test(url);
    });
}

function findMatchingSchema(url: string, schemas: string[]): string | null {
    for (const schema of schemas) {
        const regex = new RegExp("^" + schema.replace(/\*/g, ".*") + "$");
        if (regex.test(url)) {
            return schema;
        }
    }
    return null;
}

function buildSchemaIndex(providers: OEmbedProvider[]): Map<string, OEmbedEndpoint> {
    const schemaIndex = new Map<string, OEmbedEndpoint>();

    providers.forEach(provider => {
        provider.endpoints.forEach(endpoint => {
            endpoint.schemes?.forEach(scheme => {
                // Aggiungi lo schema alla mappa con il relativo URL
                schemaIndex.set(scheme.toLowerCase(), endpoint);
            });
        });
    });

    return schemaIndex;
}

function findEndpointUrlByReqUrlIndexed(reqUrl: string, providers: OEmbedProvider[]): string | undefined {
    // Cerca direttamente nell'indice degli schemi
    const schemaIndex = buildSchemaIndex(providers)
    for (const [scheme, endpoint] of schemaIndex.entries()) {
        if (matchesSchemas(reqUrl, [scheme])) {
            return endpoint.url;
        }
    }
    return undefined;
}

function findEndpointUrlByReqUrl(reqUrl: string, providers: OEmbedProvider[]): string | undefined {
    for (const provider of providers) {
        for (const endpoint of provider.endpoints) {
            if (endpoint.schemes?.some(scheme => matchesSchemas(reqUrl, [scheme]))) {
                return endpoint.url; // Restituisce l'url dell'endpoint che ha trovato una corrispondenza
            }
        }
    }
    return undefined; // Restituisce undefined se non c'è corrispondenza
}

const getOEmbed = async <T extends ProviderResponse>(req: ConsumerRequest): Promise<T> => {
    const matchedUrl = findEndpointUrlByReqUrl(req.url, providers as OEmbedProviders);

    if (!matchedUrl) {
        throw new Error('no matching schema')
    }

    const optionalQueryParamsList = [];

    if (req.maxheight) {
        optionalQueryParamsList.push(['maxheight', req.maxheight]);
    }

    if (req.maxwidth) {
        optionalQueryParamsList.push(['maxwidth', req.maxwidth]);
    }

    const optionalQueryParams = optionalQueryParamsList.reduce((p, c) => `${p}&${c[0]}=${c[1]}`, '')

    const url = `${matchedUrl}?url=${req.url}&format=json${optionalQueryParams}`; console.log(url)

    const response = await fetch(url)

    const body = await response.json();

    return body
}

export { getOEmbed };
export type { PhotoProviderResponse, VideoProviderResponse };

// (async () => await getOEmbed({ url: 'https://www.youtube.com/watch?v=Vd7ssAtckko' }))()