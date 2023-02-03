export type inputData = {
    videoNumber: number;
    endpointsNumber: number;
    requestNumber: number;
    cacheServerNumber: number;
    cacheServersCapacity: Array<number>;
}

export type Video = {
    size: number;
    requestsNumber: number;
    requestingEndpointsIds: Array<number>;
}

export type Endpoint = {
    cacheServers: Array<CacheServer>;
    dataCenterlatency: number;
}

export type CacheServer = {
    cacheServerId: number;
    endpointLatency: number;
}

export type Request = {
    requestsAmount: number;
    videoId: number;
    endpointId: number;
}
