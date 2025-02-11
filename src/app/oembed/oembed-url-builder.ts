import { ConsumerRequest } from "./oembed-models";

class OEmbedUrlBuilder {
    #oembedEndpoint?: string;
    #request?: ConsumerRequest;

    withOEmbedEndpoint(oembedEndpoint: string) {
        this.#oembedEndpoint = oembedEndpoint;
        return this;
    }

    withRequest(request: ConsumerRequest) {
        this.#request = request;
        return this;
    }

    build() {
        if (!this.#request || !this.#oembedEndpoint) {
            throw new Error('Missing parameter');
        }

        const optionalQueryParamsList = [];

        if (this.#request.maxheight) {
            optionalQueryParamsList.push(['maxheight', this.#request.maxheight]);
        }

        if (this.#request.maxwidth) {
            optionalQueryParamsList.push(['maxwidth', this.#request.maxwidth]);
        }

        const optionalQueryParams = optionalQueryParamsList.reduce((p, c) => `${p}&${c[0]}=${c[1]}`, '')

        return `${this.#oembedEndpoint}?url=${this.#request.url}&format=json${optionalQueryParams}`;
    }
}

export { OEmbedUrlBuilder };
