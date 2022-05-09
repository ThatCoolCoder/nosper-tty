import readlineSync from 'readline-sync';
import { Calculator } from './Calculator.mjs';

new Calculator(console, readlineSync.question).mainLoop();