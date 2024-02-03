import { createInterface } from 'readline';

import { Evaluator } from './lib/nosper-engine/src/Evaluator.mjs';
import * as EvaluatorErrors from './lib/nosper-engine/src/Errors.mjs';

import { loadables } from './Loadables.mjs';
import { NormalDisplayMode, ScientificDisplayMode } from './DisplayMode.mjs';
import texts from './texts.mjs';


export class InteractiveCalculator {
    running = false;
    prompt = '> ';
    commands = {
        'exit' : () => {
            this.running = false;
        }, 'help' : () => {
            this.write(texts.helpMessage)
        }, 'morehelp' : () => {
            this.write(texts.moreHelpMessage)
        }, 'ang' : () => {
            var angleModeName = this.evaluator.context.useRadians ? 'radians' : 'degrees';
            this.write(`Current angle mode is ${angleModeName}`);
        }, 'rad' : () => {
            this.switchAngleMode(true);
        }, 'deg' : () => {     
            this.switchAngleMode(false);
        }, 'load' : (args) => {
            if (args.length != 1) this.write('Expected the name of a loadable to be provided');
            if (this.checkLoadableExists(args[0])) {
                this.evaluator.applyLoadable(loadables[args[0]]);
                this.write(`Loaded ${args[0]}`);
            }
        }, 'unload' : (args) => {
            if (args.length != 1) this.write('Expected the name of a loadable to be provided');
            if (this.checkLoadableExists(args[0])) {
                this.evaluator.removeLoadable(loadables[args[0]]);
                this.write(`Unloaded ${args[0]}`);
            }
        }, 'listload' : () => {
            var formatted = Object.keys(loadables).map(k => {
                return `- ${k} (${loadables[k].name})`;
            }).join('\n');
            this.write(`Loadables:\n${formatted}`);
        }, 'loadinfo' : (args) => {
            if (args.length != 1) this.write('Expected the name of a loadable to be provided');
            if (this.checkLoadableExists(args[0])) {
                var loadable = loadables[args[0]];
                
                this.write(`${args[0]} - ${loadable.name}`);
                this.write(`${loadable.description}`);

                this.write(`Variables`);
                this.write(Object.keys(loadable.variables).map(k => {
                    return `- ${k} (${loadable.variables[k].value}): ${loadable.variables[k].description}`;
                }).join('\n'));

                this.write(`\nFunctions`);
                this.write(Object.keys(loadable.functions).map(k => {
                    var args = loadable.functions[k].args.join(', ');
                    return `- @${k}(${args}): ${loadable.functions[k].description}`;
                }).join('\n'));
            }
        }, 'dispnorm' : () => {
            this.displayMode = new NormalDisplayMode();
            this.write('Set display mode to normal');
        }, 'dispsci' : (args) => {
            var numDigits = NaN;
            if (args.length >= 1) {
                numDigits = parseFloat(args[0]);
            }
            if (isNaN(numDigits)) {
                numDigits = 4;
            }
            this.displayMode = new ScientificDisplayMode(numDigits);
            this.write(`Set display mode to scientific (${numDigits} digits)`)
        }
    };
    
    constructor(input, output, onExit, history=[], evaluator=null) {
        this.input = input;
        this.output = output;
        this.onExit = onExit;
        this.evaluator = evaluator ?? new Evaluator();
        this.displayMode = new NormalDisplayMode();

        this.rl = createInterface({
            input: this.input,
            output: this.output,
        })
        
        this.oldaddhist = this.rl._addHistory;
        var self = this;
        this.rl._addHistory = function() {
            // var last = this.rl.history[0];
            var line = self.oldaddhist.call(self.rl);
            return line;
        }

        this.rl.history.push(...history);
        
        this.input.setEncoding('utf8');
        
        
    }
    
    start() {
        this.output.write(texts.welcomeMessage);
        this.output.write("> ");
        this.running = true;
        
        this.rl.on('line', (input) => {
            var potentialCommand = input.split(' ')[0]
            if (Object.keys(this.commands).includes(potentialCommand)) {
                var remaining = input.split(' ').slice(1);
                this.commands[potentialCommand](remaining);
            }
            else {
                try {
                    var result = this.evaluator.evaluate(input);
                    this.write(this.displayMode.formatNumber(result));
                }
                catch (err) {
                    if (err instanceof EvaluatorErrors.EvaluationError) {
                        var errorMessage = err.message;
                    }
                    else {
                        var errorMessage = 'Unknown error evaluating expression';
                    }
                    this.write(errorMessage);
                }
            }

            if (this.running) this.rl.prompt();
            else this.onExit();
        });
    }

    write(value) {
        this.output.write(value + '\n');
    }

    switchAngleMode(useRadians) {
        var angleModeName = useRadians ? 'radians' : 'degrees';
        if (useRadians == this.evaluator.context.useRadians) {
            this.write(`Already in ${angleModeName} mode`);
        }
        else {
            this.write(`Switched to ${angleModeName}`);
            this.evaluator.context.useRadians = useRadians;
        }
    }

    checkLoadableExists(loadableName) {
        if (Object.keys(loadables).includes(loadableName)) {
            return true;
        }
        else {
            this.write(`Loadable ${loadableName} does not exist`);
            return false;
        }
    }
}