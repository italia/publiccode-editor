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

const getOEmbed = async <T extends ProviderResponse>(req: ConsumerRequest): Promise<T> => {
    const provider = providers.find(v => v["provider_name"].toLowerCase() === 'youtube')
    console.log(providers.length)
    console.log(JSON.stringify(provider))
    console.log(provider?.endpoints.length)
    const endpoint = provider?.endpoints[0] as { url: string; schemes: string[] };
    console.log(JSON.stringify(endpoint?.schemes))

    const schemes = endpoint?.schemes;

    const r = matchesSchemas(req.url, schemes);

    console.log(r);

    if (!r) {
        throw new Error('no matching schema')
    }

    const response = await fetch(`${endpoint?.url}?url=${req.url}`)

    const body = await response.json();

    console.log(body)

    return body
}

export { getOEmbed };
export type { PhotoProviderResponse, VideoProviderResponse };

// (async () => await findProvider({ url: 'https://www.youtube.com/watch?v=Vd7ssAtckko' }))()