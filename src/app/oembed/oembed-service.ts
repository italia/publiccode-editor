import { ConsumerRequest, ProviderResponse } from './oembed-models';
import { OEmbedUrlBuilder } from './oembed-url-builder';
import { findOEmbedEndpointUrlByReqUrl } from './providers';

const getOEmbed = async <T extends ProviderResponse>(request: ConsumerRequest, { signal }: { signal: AbortSignal }): Promise<T> => {
    const oembedEndpoint = findOEmbedEndpointUrlByReqUrl(request.url);

    if (!oembedEndpoint) {
        throw new Error('no matching schema')
    }

    const url = new OEmbedUrlBuilder()
        .withOEmbedEndpoint(oembedEndpoint)
        .withRequest(request)
        .build()

    try {
        const response = await fetch(url, { signal })

        const body = await response.json();

        return body as T;
    } catch (error) {
        if ((error as Error).name === 'AbortError') {
            console.log("Fetch aborted");
        } else {
            console.error("Failed to fetch oEmbed:", error);
        }
        throw new Error((error as Error).message)
    }
}


export { getOEmbed };
