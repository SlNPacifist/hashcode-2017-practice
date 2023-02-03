// greedy sort by requests total count
export const solve = ({
    videoSizes,
    endpoints,
    requests,
    cacheServerSize,
    cacheServersCount,
}) => {
    const availableCacheSize = Array(cacheServersCount).fill(cacheServerSize);
    const cacheServerFiles = Array.from(Array(cacheServersCount), () => []);

    const compareRequests = (req1, req2) => {
        return req2.requestsAmount - req1.requestsAmount;
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