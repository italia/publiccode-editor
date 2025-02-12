import providers from '../../../generated/providers-oembed.json';
import { OEmbedProviders } from './oembed-provider-models';

const ENDPOINTS = (providers as OEmbedProviders).flatMap(p => p.endpoints);

export { ENDPOINTS };

