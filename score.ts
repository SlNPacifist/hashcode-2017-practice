import * as fs from 'fs';
import parseInput from './input';

function parseOutput(outputPath: string) {
    const lines = fs.readFileSync(outputPath, 'utf-8');

    // Array<[number, Set<number>]>
    const cacheServersUsage: Array<[number, Set<number>]> = lines.split('\n').slice(1)
        .map(line => line.split(' ').map(Number))
        .map(([cacheServerId, ...videoIds]) => [cacheServerId, new Set(videoIds)]);

    return new Map(cacheServersUsage);
}

export function calculateScore(inputPath: string, outputPath: string) {
    const input = parseInput(inputPath);
    const output = parseOutput(outputPath);

    let savedTime = 0;
    let totalRequestAmount = 0;
    for (const { videoId, endpointId, requestsAmount } of input.requests) {
        const { dataCenterlatency, cacheServers } = input.endpoints[endpointId];
        let bestLatency = dataCenterlatency;
        for (const { cacheServerId, endpointLatency } of cacheServers) {
            if (output.get(cacheServerId).has(videoId)) {
                bestLatency = Math.min(bestLatency, endpointLatency);
            }
        }

        savedTime += requestsAmount * (dataCenterlatency - bestLatency);
        totalRequestAmount += requestsAmount;
    }
    return Math.floor(savedTime * 1000 / totalRequestAmount);
}
