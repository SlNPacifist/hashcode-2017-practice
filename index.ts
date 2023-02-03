import { solve } from './heuristic2';
import readFile from './input';
import { calculateScore } from './score';
//1492068
const input_file = './input/kittens.in.txt';

const data = readFile(input_file);

const solution = solve(data)
console.log(solution)

console.log("SCORE: ", calculateScore(input_file, solution));