export type InputData = {
    videoSizes: Array<number>;
    endpoints: Array<Endpoint>;
    requests: Array<Request>;
    cacheServerSize: number;
    cacheServersCount: number;
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

export type OutputData = Array<Set<number>>;