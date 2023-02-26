import 'node:process';
import { exit } from 'node:process';
import readlineSync from 'readline-sync';
import { Calculator } from './Calculator.mjs';
import { Evaluator } from './lib/nosper-engine/src/Evaluator.mjs';
import * as EvaluatorErrors from './lib/nosper-engine/src/Errors.mjs';

if (process.argv.length > 2)
{
    // Run in batch mode
    var equation = process.argv[2];

    var exitCode = 0;
    try
    {
        var result = new Evaluator().evaluate(equation);
        console.log(result);
    }
    catch (err)
    {
        if (err instanceof EvaluatorErrors.EvaluationError) {
            var errorMessage = err.message;
        }
        else {
            var errorMessage = 'Unknown error evaluating expression';
        }
        console.error(errorMessage);
        exitCode = 1;
    }

    process.exit(exitCode);
}
else
{
    // Run interactive mode
    new Calculator(console, readlineSync.question).mainLoop();
}