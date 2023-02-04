import * as fs from 'fs';
import parseInput from './input';
import { OutputData } from './types';
import { numbers } from './parser';

function parseOutput(outputContent: string): OutputData {
    const res: OutputData = [];
    // Array<[number, Set<number>]>
    const lines = outputContent.split('\n').reverse();

    let n = Number(lines.pop());
    while (n--) {
        let [id, ...videoIds] = numbers(lines);
        res[id] = new Set(videoIds);
    }
    for (let i = 0; i < res.length; i += 1) {
        if (!res[i]) {
            res[i] = new Set();
        }
    }

    return res;
}

export function calculateScoreFile(inputPath: string, outputPath: string) {
    const outputContent = fs.readFileSync(outputPath, 'utf-8');
    const output = parseOutput(outputContent);
    return calculateScore(inputPath, output);
}

export function calculateScore(inputPath: string, output: OutputData) {
    const input = parseInput(inputPath);

    let savedTime = 0;
    let totalRequestAmount = 0;
    for (const { videoId, endpointId, requestsAmount } of input.requests) {
        const { dataCenterlatency, cacheServers } = input.endpoints[endpointId];
        let bestLatency = dataCenterlatency;
        for (const { cacheServerId, endpointLatency } of cacheServers) {
            if (output[cacheServerId].has(videoId)) {
                bestLatency = Math.min(bestLatency, endpointLatency);
            }
        }

        savedTime += requestsAmount * (dataCenterlatency - bestLatency);
        totalRequestAmount += requestsAmount;
    }
    return Math.floor(savedTime * 1000 / totalRequestAmount);
}
