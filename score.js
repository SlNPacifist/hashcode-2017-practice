const fs = require('fs');
const parseInput = require('./input.js');

function parseOutput(outputPath) {
    const lines = fs.readFileSync(outputPath, 'utf-8');

    // Array<[number, Set<number>]>
    const cacheServersUsage = lines.split('\n').slice(1)
        .map(line => line.split(' ').map(Number))
        .map(([cacheServerId, ...videoIds]) => [cacheServerId, new Set(videoIds)]);

    return new Map(cacheServersUsage);
}

module.exports = function calculateScore(inputPath, outputPath) {
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
};
