import { solve } from './heuristic2';
import readFile from './input';
import { calculateScore } from './score';

const input_file = './input/videos_worth_spreading.in';

const data = readFile(input_file);

const solution = solve(data)

// console.log(solution)
const output = new Map();
for (let i = 0; i < solution.length; i++) {
    output.set(i, new Set());
    for (let j = 0; j < solution[i].length; j++) {
        output.get(i).add(solution[i][j]);
    }
}
console.log("SCORE: ", calculateScore(input_file, output));