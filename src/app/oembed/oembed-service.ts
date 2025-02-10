import { ConsumerRequest, ProviderResponse } from './oembed-models';
import { OEmbedUrlBuilder } from './oembed-url-builder';
import { findOEmbedEndpointUrlByReqUrl } from './providers';

const getOEmbed = async <T extends ProviderResponse>(request: ConsumerRequest): Promise<T> => {
    const oembedEndpoint = findOEmbedEndpointUrlByReqUrl(request.url);

    if (!oembedEndpoint) {
        throw new Error('no matching schema')
    }

    const url = new OEmbedUrlBuilder()
        .withOEmbedEndpoint(oembedEndpoint)
        .withRequest(request)
        .build()

    const response = await fetch(url)

    const body = await response.json();

    return body
}

export { getOEmbed };
