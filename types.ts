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

export type Endpoint = Array<{
    cacheServers: CacheServers;
    dataCenterlatency: number;
}>

export type CacheServers = Array<{
    cacheServerId: number;
    endpointLatency: number;
}>

export type Requests = Array<{
    requestsAmount: number;
    videoId: number;
    endpointId: number;
}>