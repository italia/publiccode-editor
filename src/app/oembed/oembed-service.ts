import { ConsumerRequest, ProviderResponse } from './oembed-models';
import { findEndpointUrlByReqUrl } from './providers';

const getOEmbed = async <T extends ProviderResponse>(req: ConsumerRequest): Promise<T> => {
    const matchedUrl = findEndpointUrlByReqUrl(req.url);

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
