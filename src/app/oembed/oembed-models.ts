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

export type { ConsumerRequest, PhotoProviderResponse, ProviderResponse, VideoProviderResponse };

