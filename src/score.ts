import * as fs from 'fs';
import parseInput from './input';

function parseOutput(outputContent: string): Map<number, Set<number>> {
    // Array<[number, Set<number>]>
    const cacheServersUsage: Array<[number, Set<number>]> = outputContent.split('\n').slice(1)
        .map(line => line.split(' ').map(Number))
        .map(([cacheServerId, ...videoIds]) => [cacheServerId, new Set(videoIds)]);

    return new Map(cacheServersUsage);
}

export function calculateScoreFile(inputPath: string, outputPath: string) {
    const outputContent = fs.readFileSync(outputPath, 'utf-8');
    const output = parseOutput(outputContent);
    return calculateScore(inputPath, output);
}

export function calculateScore(inputPath: string, output: Map<number, Set<number>>) {
    const input = parseInput(inputPath);

    let savedTime = 0;
    let totalRequestAmount = 0;
    for (const { videoId, endpointId, requestsAmount } of input.requests) {
        const { dataCenterlatency, cacheServers } = input.endpoints[endpointId];
        let bestLatency = dataCenterlatency;
        for (const { cacheServerId, endpointLatency } of cacheServers) {
            if (output.get(cacheServerId)?.has(videoId)) {
                bestLatency = Math.min(bestLatency, endpointLatency);
            }
        }

        savedTime += requestsAmount * (dataCenterlatency - bestLatency);
        totalRequestAmount += requestsAmount;
    }
    return Math.floor(savedTime * 1000 / totalRequestAmount);
}
