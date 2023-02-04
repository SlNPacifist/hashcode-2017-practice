// greedy sort by requests total count
import { InputData, Request } from "../types";

const compareRequests = (req1: Request, req2: Request) => {
    return req2.requestsAmount - req1.requestsAmount;
}


export const solve = ({
    videoSizes,
    endpoints,
    requests,
    cacheServerSize,
    cacheServersCount,
}: InputData) => {
    const availableCacheSize = Array(cacheServersCount).fill(cacheServerSize);
    const cacheServerFiles: Array<Set<number>> = new Array(cacheServersCount).fill(0).map(() => new Set());

    const sortedRequests = [...requests].sort(compareRequests);

    sortedRequests.forEach(req => {
        const videoSize = videoSizes[req.videoId];
        const endpoint = endpoints[req.endpointId];
        const availableCacheServers = endpoint.cacheServers
            .filter(
                ({ cacheServerId, endpointLatency }) => (availableCacheSize[cacheServerId] >= videoSize))
            .sort((c1, c2) => c1.endpointLatency - c2.endpointLatency);
        if (availableCacheServers.length > 0) {
            const cacheServer = availableCacheServers[0];
            cacheServerFiles[cacheServer.cacheServerId].add(req.videoId);
            availableCacheSize[cacheServer.cacheServerId] -= videoSize;
        }
    });

    return cacheServerFiles;
}
