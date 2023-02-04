import { solve } from './solutions/heuristic';
import { solve as solve2 } from './solutions/heuristic2';
import readFile from './input';
import { calculateScore } from './score';
const solutions = {
    // heuristic: solve,
    heuristic2: solve2,
}
const files = [
    // 'example.in.txt',
    'kittens.in.txt',
    'me_at_the_zoo.in',
    'trending_today.in',
    'videos_worth_spreading.in'
];
for (const input_file of files) {
    const full_input_file = `./input/${input_file}`;
    const data = readFile(full_input_file);
    for (const [solutionName, solve] of Object.entries(solutions)) {
        const solution = solve(data);
        console.log(`SCORE ${input_file} ${solutionName}: ${calculateScore(full_input_file, solution)}`);
    }
}
