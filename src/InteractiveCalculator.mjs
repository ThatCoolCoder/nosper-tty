import { Evaluator } from './lib/nosper-engine/src/Evaluator.mjs';
import * as EvaluatorErrors from './lib/nosper-engine/src/Errors.mjs';

import { loadables } from './Loadables.mjs';
import { NormalDisplayMode, ScientificDisplayMode } from './DisplayMode.mjs';

// Messages not in class so indent doesn't get in the way
const calculatorWelcomeMessage = 
`Nosper TTY - Open source terminal-based calculator.

Type "exit" to exit, "help" for help, or "morehelp" for in-depth documentation.
`;

const commandsHelpText = 
`Commands:
 exit               Exit the program
 help               Show this menu
 morehelp           Show detailed documentation on all functions
 ang                Display current angle mode
 rad                Switch to radians
 deg                Switch to degrees
 load <set>         Load a set of variables and functions (use listload to see available sets)
 unload <set>       Unload a previously loaded set
 listload           List loadable items
 loadinfo <set>     List data contained within a loadable
 dispnorm           Set display mode to normal
 dispsci <ndigits>  Set display mode to scientific with N digits after the decimal place`

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

Input:
 Type an expression and press enter.

 Multiple expressions:
  Multiple expressions can be put on one line by separating them with semicolons
  The value of the last expression is the one returned.
  For example:
   3 * 3; 4 * 4       = 16

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

 Previous answer:
  Type "ans" to read the previous answer. It can be used anywhere a variable or number could be written.
  Note that if you enter multiple expressions separated by a semicolon, ans is only updated at the end of the set of expressions.
  For example, if you entered the following expression groups one after each other, the final result would be
   5 + 5            = 10
   2 + 2; ans + 2   = 12 (not 6)

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
`;

export class InteractiveCalculator {
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
        }, 'load' : (args) => {
            if (args.length != 1) this.console.log('Expected the name of a set to be provided');
            if (this.checkLoadableExists(args[0])) {
                this.evaluator.load(loadables[args[0]]);
                this.console.log(`Loaded ${args[0]}`);
            }
        }, 'unload' : (args) => {
            if (args.length != 1) this.console.log('Expected the name of a set to be provided');
            if (this.checkLoadableExists(args[0])) {
                this.evaluator.unload(loadables[args[0]]);
                this.console.log(`Unloaded ${args[0]}`);
            }
        }, 'listload' : () => {
            var formatted = Object.keys(loadables).map(k => {
                return `- ${k} (${loadables[k].description})`;
            }).join('\n');
            this.console.log(`Loadables:\n${formatted}`);
        }, 'loadinfo' : (args) => {
            if (args.length != 1) this.console.log('Expected the name of a set to be provided');
            if (this.checkLoadableExists(args[0])) {
                var loadable = loadables[args[0]];
                
                this.console.log(`Variables in ${args[0]}`);
                this.console.log(loadable.variables.listData().map(k => {
                    return `- $${k} (${loadable.variables.get(k)}): ${loadable.variableIndex[k]}`;
                }).join('\n'));

                this.console.log(`\nFunctions in ${args[0]}`);
                this.console.log(loadable.functions.listData().map(k => {
                    return `- &${k}: ${loadable.functionIndex[k]}`;
                }).join('\n'));
            }
        }, 'dispnorm' : () => {
            this.displayMode = new NormalDisplayMode();
            this.console.log('Set display mode to normal');
        }, 'dispsci' : (args) => {
            var numDigits = NaN;
            if (args.length >= 1) {
                numDigits = parseFloat(args[0]);
            }
            if (isNaN(numDigits)) {
                numDigits = 2;
            }
            this.displayMode = new ScientificDisplayMode(numDigits);
            this.console.log(`Set display mode to scientific (${numDigits} digits)`)
        }
    };
    
    constructor(_console, readlineFunc, evaluator=null) {
        this.console = _console;
        this.readline = readlineFunc;
        this.evaluator = evaluator ?? new Evaluator();
        this.displayMode = new NormalDisplayMode();
    }
    
    mainLoop() {
        this.console.log(calculatorWelcomeMessage);

        this.running = true;

        while (this.running) {
            var input = this.readline(this.prompt).trim();
            var potentialCommand = input.split(' ')[0]
            if (Object.keys(this.commands).includes(potentialCommand)) {
                var remaining = input.split(' ').slice(1);
                this.commands[potentialCommand](remaining);
            }
            else {
                try {
                    var result = this.evaluator.evaluate(input);
                    this.console.log(this.displayMode.formatNumber(result));
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

    checkLoadableExists(loadableName) {
        if (Object.keys(loadables).includes(loadableName)) {
            return true;
        }
        else {
            this.console.log(`Loadable ${loadableName} does not exist`);
            return false;
        }
    }
}