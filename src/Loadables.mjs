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

    constructor(description, longDescription, variableDict, functionDict) {
        super();

        this.description = description;
        this.longDescription = longDescription;

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
    phys : new CustomLoadable('Physics utilities',
        'Works niecely with the "unit" loadable',
        {
            'g' : ['Force of gravity on earth', 9.81],
            'G' : ['Universal gravitatonal constant', 6.6743e-11],
            'c' : ['Speed of light (in metres per second)', 299792458]
        },
        {
            'grav' : ['Force of gravity (distance, m1, m2)', '$G $1 $2 / $0^2'],
            'earthrange' : ['Range of thrown object on earth (speed in m/s, angle)', '$0^2 sin(2$1) / $g'],
            'range' : ['Range of thrown object (speed in m/s, angle, gravity)', '$0^2 sin(2$1) / $2'],
            'weight' : ['Weight of object on earth (object mass)',  '$g $0'],
            'acceldist' : ['Distance moved by an accelerating object (V0, a, t)', '$0 $2 + 0.5 $1 $2^2']
        }),
    geom : new CustomLoadable('Geometry - Euclidean', 
        'Does not do much because there is no engine support for vector/coordinate types ',
        {

        },
        {
            'circlearea' : ['Area of a circle (radius)', '$pi $0^2'],
            'circlearead' : ['Area of a circle from a diameter (diameter)', '$pi ($0/2)^2']
        }),
    misc : new CustomLoadable('Miscellaneous stuff', '',
        {

        },
        {
            'roundto' : ['Round a number to n places (number, places)', 'round($0 10^$1)/10^$1'],
        }),
    unit : new CustomLoadable('Units of measurement', 
        'Variables defining ratios to the SI units of measurement, that can be used like "3 $in". Use',
        {
            // Distance
            'km' : ['', 1000],
            'm' : ['', 1],
            'dm' : ['', 0.1],
            'cm' : ['', 0.01],
            'mm' : ['', 0.001],
            'um' : ['', 1e-6],

            'in' : ['', 0.0254],
            'ft' : ['', 0.0254],
            'mile' : ['', 0.0254],

            // Area
            'km2' : ['', 1000 * 1000],
            'm2' : ['', 1],
            'dm2' : ['', 0.1 * 0.1],
            'cm2' : ['', 0.01 * 0.01],
            'mm2' : ['', 0.001 * 0.001],
            'um2' : ['', 1e-6 * 1e-6]

            // Volume - cubic

            // Volume - not cubic
        },
        {
            'roundto' : ['Round a number to n places (number, places)', 'round($0 10^$1)/10^$1'],
        })
};
