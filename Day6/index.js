import { add, subtract } from "./math.js";
import chalk from 'chalk';

console.log(chalk.green("Addition: "), add(10, 5));
console.log(chalk.red("Substraction: "), subtract(10, 5));