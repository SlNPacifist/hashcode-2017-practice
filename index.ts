import { solve } from './heuristic2';
import readFile from './input';
import { calculateScore } from './score';

const input_file = './input/trending_today.in';

const data = readFile(input_file);

const solution = solve(data)
console.log(solution)

console.log("SCORE: ", calculateScore(input_file, solution));