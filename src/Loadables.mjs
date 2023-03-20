import { ValueGroup } from "./lib/nosper-engine/src/EvaluationContext.mjs";
import { Loadable } from "./lib/nosper-engine/src/Loadable.mjs";
import { Evaluator } from "./lib/nosper-engine/src/Evaluator.mjs";

// evaluator used for preprocessing functions
var constructionEvaluator = new Evaluator();

export class CustomLoadable extends Loadable {
    // Custom loadable that is easier to init, and has additional data
    // construct like so:
    //  new CustomLoadable('My amazing loadable', {
    //      'gravity' : ['it is a very good number', 9.81]
    //  }, {
    //      'my_func' : ['magic function that squares a number', '$0 * $0']
    //  }
    // })

    constructor(description, variableDict, functionDict) {
        super();

        this.description = description;

        var [variables, variableIndex] = this.processDataDict(variableDict);
        this.variables = new ValueGroup(variables);
        this.variableIndex = variableIndex;
        
        var [functions, functionIndex] = this.processDataDict(functionDict);
        
        Object.keys(functions).forEach(key => {
            functions[key] = constructionEvaluator.compileSingleExpression(functions[key]);
        });
        this.functions = new ValueGroup(functions);
        this.functionIndex = functionIndex;
    }

    processDataDict(mixedDataDict) {
        // process an input dict into a dict of data and a dict serving as index
        var result = {};
        var index = {};
        for (var k in mixedDataDict) {
            index[k] = mixedDataDict[k][0];
            result[k] = mixedDataDict[k][1];
        }
        return [result, index];
    }
}

export const loadables = {
    phys : new CustomLoadable('Physics utilities', {
        'g' : ['Force of gravity on earth', 9.81],
        'G' : ['Universal gravitatonal constant', 6.6743e-11],
    }, {
        'grav' : ['Force of gravity (distance, m1, m2)', '$G * ($1 * $2) / $0^2'],
        'earthrange' : ['Range of thrown object on earth (speed in m/s, angle)', '$0 $0 sin(2$1) / $g'],
        'range' : ['Range of thrown object (speed in m/s, angle, gravity)', '$0 $0 sin(2$1) / $2'],
        'weight' : ['Weight of object on earth (object mass)',  '$g $0']
    })
};