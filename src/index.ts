import { table } from 'table';

import { solve as heuristic } from './solutions/heuristic';
import { solve as heuristic2 } from './solutions/heuristic2';
import { solve as heuristic3 } from './solutions/heuristic3';
import { solve as heuristic4 } from './solutions/heuristic4';
import readFile from './input';
import { calculateScore } from './score';
const solutions = {
    heuristic,
    heuristic2,
    heuristic3,
    heuristic4,
}
const files = [
    // 'example.in.txt',
    'kittens.in.txt',
    'me_at_the_zoo.in',
    'trending_today.in',
    'videos_worth_spreading.in'
];

const tableData = [['', ...Object.keys(solutions), 'best']];
const totalScore = new Array<number>(Object.keys(solutions).length + 1).fill(0);
const solutionFuncs = Object.values(solutions);
for (const input_file of files) {
    const full_input_file = `./input/${input_file}`;
    const data = readFile(full_input_file);
    const tableRow = [input_file];
    let best = 0;
    for (let i = 0; i < solutionFuncs.length; i += 1) {
        const solve = solutionFuncs[i];
        const solution = solve(data);
        const score = calculateScore(full_input_file, solution);
        tableRow.push(String(score));
        totalScore[i] += score;
        best = Math.max(best, score);
    }
    totalScore[solutionFuncs.length] += best;
    tableRow.push(String(best));
    tableData.push(tableRow);
}

tableData.push(['Total', ...totalScore.map(String)]);

console.log(table(tableData, { columnDefault: { alignment: 'right' }}));