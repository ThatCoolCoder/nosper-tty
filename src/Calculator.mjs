import { Evaluator } from './lib/nosper-engine/src/Evaluator.mjs';

// Messages of class so indent doesn't get in the way
const calculatorWelcomeMessage = `
Nosper TTY
Open source terminal-based calculator.

Type "exit" to exit, "help" for help, or "morehelp" for in-depth documentation.
`;

const calculatorHelpMessage = `
Usage (WIP)
-----------

Basic operators: 
 Addition:          +
 Subtraction:       -
 Multiplication:    *
 Division:          /
 Exponentiation:    ** or ^

The calculator respects order of operations and brackets

Example expressions:
 1 + 2                      = 3
 2 + 3 * 4                  = 14
 (2 + 3) * 4                = 20
 sin 1                      Calc sine of 1
 sin(1 + 2)                 Calc sine of complex expression
 $myvalue = sin(1 + 2)      Set variable to value
 sqrt $myvalue              Calc square root of variable
 $a = $b = 5                Sets a and b to 5

You can input numbers in a variety of ways:
 10
 0.5
 .5         = 0.5
 5 * e3     = 5000

Whitespace is largely optional and some functions have abbreviations:
 2+3*4      Same as 2 + 3 * 4
 sin15      Same as sin(15)
 q2         Same as sqrt 2

Multiple expressions can be put on one line by separating them with semicolons:
 3 * 3; 4 * 4       = 16
 $x = 3; $x^2       = 9

Enter "morehelp" for a full reference of functions`;

const calculatorMoreHelpMessage = `Todo: write this
`

export class Calculator {
    running = false;
    prompt = '> ';
    commands = { 'exit' : () => {
        this.running = false;
    }, 'help' : () => {
        this.console.log(calculatorHelpMessage)
    }, 'morehelp' : () => {
        this.console.log(calculatorMoreHelpMessage)
    }};
    
    constructor(_console, readline, evaluator=null) {
        this.console = _console;
        this.readline = readline;
        this.evaluator = evaluator ?? new Evaluator();
    }
    
    mainLoop() {
        this.console.log(calculatorWelcomeMessage);

        this.running = true;

        while (this.running) {
            var input = this.readline(this.prompt).trim();
            if (Object.keys(this.commands).includes(input)) {
                this.commands[input]();
            }
            else {
                try {
                    this.console.log(this.evaluator.evaluate(input).toString());
                }
                catch (err) {
                    if (err instanceof Evaluator.MathSyntaxError) {
                        var error = 'Syntax error in expression';
                    }
                    else {
                        var error = 'Error evaluating expression';
                    }
                    this.console.log(error);
                }
            }
        }
    }
}