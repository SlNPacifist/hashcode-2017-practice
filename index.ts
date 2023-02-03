import { solve } from './heuristic';
import readFile from './input';
const data = readFile('./input/example.in.txt');

const solution = solve(data)

console.log(solution)