import type { CacheServers, Endpoint, Requests } from "./types";
import * as fs from "fs";

function numbers(lines: Array<string>) {
    return lines.pop()!.split(' ').map(Number);
}

export default function readFile(filename: string) {
    const data = fs.readFileSync(filename, 'utf-8');
    const lines = data.split('\n').reverse();
    let [v, e, r, cacheServersCount, cacheServerSize] = numbers(lines);
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
        cacheServersCount,
    }
}