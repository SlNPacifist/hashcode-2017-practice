import type { CacheServers, Endpoint, Requests } from "./types";

const fs = require('fs');

function numbers(lines) {
    return lines.pop().split(' ').map(Number);
}

module.exports = function readFile(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    const lines = data.split('\n').reverse();
    let [v, e, r, c, cacheServerSize] = numbers(lines);
    const videoSizes = numbers(lines);
    const endpoints: Endpoint = [];

    while (e--) {
        let [dataCenterlatency, k] = numbers(lines);
        const cacheServers: CacheServers = [];
        while (k--) {
            const [cacheServerId, endpointLatency] = numbers(lines);
            cacheServers.push({cacheServerId, endpointLatency});
        }
        endpoints.push({
            dataCenterlatency,
            cacheServers,
        });
    }

    const requests: Requests = [];
    while (r--) {
        const [videoId, endpointId, requestsAmount] = numbers(lines);
        requests.push({ videoId, endpointId, requestsAmount });
    }

    return {
        videoSizes,
        endpoints,
        requests,
        cacheServerSize,
    }
}