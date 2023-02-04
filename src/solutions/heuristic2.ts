import { InputData, Request } from "../types";
import Heap from "heap";
import _ from "lodash";

export const solve = ({
    videoSizes,
    endpoints,
    requests,
    cacheServerSize,
    cacheServersCount,
}: InputData) => {
    const availableCacheSize = Array(cacheServersCount).fill(cacheServerSize);
    const cacheServerFiles: Array<Set<number>> = new Array(cacheServersCount).fill(0).map(() => new Set());
    const scoredRequests = requests.map(r => ({...r, score: bestScore(r)}));
    const actions = new Heap<typeof scoredRequests[0]>((a, b) => b.score - a.score);
    for (const r of scoredRequests) {
        actions.push(r);
    }

    function bestScore(req: Request): number {
        const videoSize = videoSizes[req.videoId];
        const endpoint = endpoints[req.endpointId];

        const cacheServersWithFile = endpoint.cacheServers
            .filter(
                ({ cacheServerId }) => (cacheServerFiles[cacheServerId].has(req.videoId))
            );

        const minLatency = _.min(_.map(cacheServersWithFile, 'endpointLatency')) ?? endpoint.dataCenterlatency;

        const availableCacheServers = endpoint.cacheServers
            .filter(
                ({ cacheServerId }) => (availableCacheSize[cacheServerId] >= videoSize)
            );

        if (!availableCacheServers.length) {
            return 0;
        }
        
        const bestCacheServer = _.minBy(availableCacheServers, "endpointLatency")!;
        const score = (minLatency - bestCacheServer.endpointLatency) * req.requestsAmount;
        
        return score;
    }

    while (true) {
        let bestRequest = actions.pop();
        if (!bestRequest) {
            break;
        }

        let score = bestScore(bestRequest);
        if (score !== bestRequest.score) {
            bestRequest.score = score;
            actions.push(bestRequest)
            continue;
        }

        if (score <= 0) {
            break;
        }

        const videoSize = videoSizes[bestRequest.videoId];
        const endpoint = endpoints[bestRequest.endpointId];
        const availableCacheServers = endpoint.cacheServers
            .filter(
                ({ cacheServerId }) => (availableCacheSize[cacheServerId] >= videoSize));
        const cacheServer = _.minBy(availableCacheServers, 'endpointLatency');
        if (!cacheServer) {
            throw new Error("Unexpectedly cacheServer not found");
        }
        cacheServerFiles[cacheServer.cacheServerId].add(bestRequest.videoId);
        availableCacheSize[cacheServer.cacheServerId] -= videoSize;
    }

    return cacheServerFiles;
}
