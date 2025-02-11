import { writeFile } from "fs/promises";

const URL = 'https://oembed.com/providers.json';

async function getProviders() {
    return fetch(URL).then(res => res.json())
}

(async () => {
    try {
        const licenses = await getProviders();
        await writeFile(process.argv[2], JSON.stringify(licenses));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();