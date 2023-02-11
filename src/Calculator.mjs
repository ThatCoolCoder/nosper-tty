import { Evaluator } from './lib/nosper-engine/src/Evaluator.mjs';
import * as EvaluatorErrors from './lib/nosper-engine/src/Errors.mjs';

// Messages of class so indent doesn't get in the way
const calculatorWelcomeMessage = `
Nosper TTY
Open source terminal-based calculator.

Type "exit" to exit, "help" for help, or "morehelp" for in-depth documentation.
`;

const commandsHelpText = 
`Commands:
exit       Exit the program
help       Show this menu
morehelp   Show detailed documentation on all functions
ang        Display current angle mode
rad        Switch to radians
deg        Switch to degrees`

const operatorsHelpText = 
`Basic operators: 
Addition:          +
Subtraction:       -
Multiplication:    * or x
Division:          /
Exponentiation:    ** or ^`

const calculatorHelpMessage = `
Basic usage
-----------

${commandsHelpText}

${operatorsHelpText}

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

Multiplication signs can be ommitted in many situations:
 10 (8 + 2)             = 100
 (1 + 2)(2 + 3)         = 15
 &fourth_root(16)2$pi   = 12.566...

Multiple expressions can be put on one line by separating them with semicolons (the value of the last expression is the one returned):
 3 * 3; 4 * 4       = 16
 $x = 3; $x^2       = 9

Enter "morehelp" for a full reference of functions and features`;

const calculatorMoreHelpMessage = `
Detailed documentation
----------------------

${commandsHelpText}

${operatorsHelpText}

Memory:
 Variables:
  Variables are referred to by putting a dollar sign in front of their name
  Assign a variable like so:                    $varname = 10
  It can then be used in further calculations:  $varname * 2
 
 Custom functions:
  Functions are defined somewhat similarly to variable assignment: $calc_area => $0 * $1
   To read argument N, use the notation $N
   For example, the first argument is $0 and the second is $1
  Call a function like so: &calc_area(45, 10)
   Pass arguments into the function by putting them inside brackets, separated by commas

Inbuilt constants (predefined variables):
 Pi                     $pi     3.141...
 Tau                    $tau    6.283...
 Phi (Golden ratio)     $phi    1.618...
 Silver ratio           $silv   2.414...

Inbuilt functions (shown with example inputs):
 Trigonometry:
   Sine         sin 45
   Arc sine     asin 1
   Cosine       cos 45
   Arc cosine   acos 45
   Tangent      tan 45
   Arc tangent  atan 45
 
 Roots:
  Square root   sqrt 2  or  q 2
  Cube root     cbrt 8  or  c 8

 Other:
  Absolute value            abs -1
  Logarithm (base 10)       log 250
  Natural logarithm         ln 10
  Round value either way    round 0.64
  Round down                floor 0.77
  Round up                  ceil 4.55
`

export class Calculator {
    running = false;
    prompt = '> ';
    commands = {
        'exit' : () => {
            this.running = false;
        }, 'help' : () => {
            this.console.log(calculatorHelpMessage)
        }, 'morehelp' : () => {
            this.console.log(calculatorMoreHelpMessage)
        }, 'ang' : () => {
            var angleModeName = this.evaluator.context.useRadians ? 'radians' : 'degrees';
            this.console.log(`Current angle mode is ${angleModeName}`);
        }, 'rad' : () => {
            this.switchAngleMode(true);
        }, 'deg' : () => {     
            this.switchAngleMode(false);
        }
    };
    
    constructor(_console, readlineFunc, evaluator=null) {
        this.console = _console;
        this.readline = readlineFunc;
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
                    if (err instanceof EvaluatorErrors.EvaluationError) {
                        var errorMessage = err.message;
                    }
                    else {
                        var errorMessage = 'Unknown error evaluating expression';
                    }
                    this.console.log(errorMessage);
                }
            }
        }
    }

    switchAngleMode(useRadians) {
        var angleModeName = useRadians ? 'radians' : 'degrees';
        if (useRadians == this.evaluator.context.useRadians) {
            this.console.log(`Already in ${angleModeName} mode`);
        }
        else {
            this.console.log(`Switched to ${angleModeName}`);
            this.evaluator.context.useRadians = useRadians;
        }
    }
}