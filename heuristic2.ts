import { inputData, Request } from "./types";

export const solve = ({
    videoSizes,
    endpoints,
    requests,
    cacheServerSize,
    cacheServersCount,
}: inputData) => {
    const availableCacheSize = Array(cacheServersCount).fill(cacheServerSize);
    const cacheServerFiles = Array.from(Array(cacheServersCount), () => []);

    const compareRequests = (req1: Request, req2: Request) => {
        const size1 = videoSizes[req1.videoId];
        const size2 = videoSizes[req2.videoId];
        return req2.requestsAmount / Math.sqrt(size2) - req1.requestsAmount / Math.sqrt(size1);
    }

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
            // @ts-ignore
            cacheServerFiles[cacheServer.cacheServerId].push(req.videoId);
            availableCacheSize[req.videoId] -= videoSize;
        }
    });

    return cacheServerFiles;
}
