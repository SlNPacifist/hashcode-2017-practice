import { inputData, Request } from "./types";
import _ from "lodash";

export const solve = ({
    videoSizes,
    endpoints,
    requests,
    cacheServerSize,
    cacheServersCount,
}: inputData) => {
    const availableCacheSize = Array(cacheServersCount).fill(cacheServerSize);
    const cacheServerFiles: Map<number, Set<number>> = new Map(Array(cacheServersCount).fill(0).map((_, i) => [i, new Set()]));
    const reqScore: Map<Request, number> = new Map();
    const reqByVideoId: Map<number, Request[]> = new Map();
    requests.forEach(req => {
        const requests = reqByVideoId.get(req.videoId) || [];
        reqByVideoId.set(req.videoId, requests.concat(req));
    });

    const bestScore = (req: Request) => {
        if (reqScore.has(req)) {
            return reqScore.get(req)!;
        }

        const videoSize = videoSizes[req.videoId];
        const endpoint = endpoints[req.endpointId];

        const cacheServersWithFile = endpoint.cacheServers
            .filter(
                ({ cacheServerId }) => (cacheServerFiles.get(cacheServerId)?.has(req.videoId))
            );

        const minLatency = _.min(cacheServersWithFile
            .map(({ endpointLatency }) => endpointLatency)
            .concat(endpoint.dataCenterlatency)
        )!;

        const availableCacheServers = endpoint.cacheServers
            .filter(
                ({ cacheServerId, endpointLatency }) => (availableCacheSize[cacheServerId] >= videoSize)
            );

        if (!availableCacheServers.length) {
            return 0;
        }
        
        const bestCacheServer = _.minBy(availableCacheServers, "endpointLatency")!;
        const score = (minLatency - bestCacheServer.endpointLatency) * req.requestsAmount;
        reqScore.set(req, score);
        
        return score;
    }

    for (let i = 0; i < requests.length; i++) {
        let bestRequest = _.maxBy(requests, bestScore)!;
        let score = bestScore(bestRequest);
        console.log(i, score);
        if (!bestRequest || score <= 0) {
            break;
        }
        const videoSize = videoSizes[bestRequest.videoId];
        const endpoint = endpoints[bestRequest.endpointId];
        const availableCacheServers = endpoint.cacheServers
            .filter(
                ({ cacheServerId, endpointLatency }) => (availableCacheSize[cacheServerId] >= videoSize))
            .sort((c1, c2) => c1.endpointLatency - c2.endpointLatency);
        if (availableCacheServers.length > 0) {
            const cacheServer = availableCacheServers[0];
            // @ts-ignore
            cacheServerFiles.get(cacheServer.cacheServerId).add(bestRequest.videoId);
            availableCacheSize[bestRequest.videoId] -= videoSize;

            // clear cache
            const cachedRequests = reqByVideoId.get(bestRequest.videoId) || [];
            cachedRequests.forEach(req => reqScore.delete(req));
        }
    }

    return cacheServerFiles;
}
