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

export const loadables = {};

loadables.phys = new CustomLoadable(
    'Physics utilities',
    'Works nicely with the "unit" loadable',
    {
        'grav' : ['Force of gravity on earth', 9.81],
        'G' : ['Universal gravitatonal constant', 6.6743e-11],
        'c' : ['Speed of light (in metres per second)', 299792458]
    },
    {
        'grav' : ['Force of gravity (distance, m1, m2)', '$G $1 $2 / $0^2'],
        'earthrange' : ['Range of thrown object on earth (speed in m/s, angle)', '$0^2 sin(2$1) / $g'],
        'range' : ['Range of thrown object (speed in m/s, angle, gravity)', '$0^2 sin(2$1) / $2'],
        'weight' : ['Weight of object on earth (object mass)',  '$g $0'],
        'acceldist' : ['Distance moved by an accelerating object (V0, a, t)', '$0 $2 + 0.5 $1 $2^2']
    });

loadables.geom = new CustomLoadable(
    'Geometry - Euclidean', 
    'Does not do much because there is no engine support for vector/coordinate types ',
    {

    },
    {
        'circlearea' : ['Area of a circle (radius)', '$pi $0^2'],
        'circlearead' : ['Area of a circle from a diameter (diameter)', '$pi ($0/2)^2']
    });

loadables.misc = new CustomLoadable(
    'Miscellaneous stuff',
    'Currently a single function, needs expansion',
    {

    },
    {
        'roundto' : ['Round a number to n places (number, places)', 'round($0 10^$1)/10^$1'],
    });

loadables.combin = new CustomLoadable(
    'Combinatorics',
    'Combinations, permutations, etc',
    {

    },
    {
        // we don't have loops or if statements yet, so this has to use some recursion and arithmetic tricks
        'fac' : ['Factorial of (n)', '($0 ? ($0 * &fac($0-1) - 1)) + 1'],
        'npr' : ['Permutations (number of items, number to choose)', '&fac($0)/&fac($0-$1)'],
        'perm' : ['Same as npr', '&npr($0, $1)'],
        'ncr' : ['Combinations (number of items, number to choose)', '&npr($0, $1)/&fac($1)'],
        'combin' : ['Same as ncr', '&ncr($0, $1)'],
    });

// Construct unit loadable
// -----------------------

// There are lots of length units and they're very repetitive so we do not manually code all the vars

var baseLengthUnits = {
    // Please order things from small to big, but keep metric and archaic separate
    'nm' : ['Nanometres', 1e-9],
    'um' : ['Micrometres', 1e-6],
    'mm' : ['Millimetres', 1e-3],
    'cm' : ['Centimetres', 0.01],
    'dm' : ['Decimetres', 0.1],
    'm' : ['Metres', 1],
    'km' : ['Kilometres', 1000],
    'Mm' : ['Megametres', 1e6],
    'gm' : ['Gigametres', 1e9],

    'in' : ['Inches', 0.0254],
    'ft' : ['Feet', 0.3048],
    'yd' : ['Yards', 0.9144],
    'fur' : ['Furlongs', 201.168],
    'le' : ['Leagues', 4.828032e3],
    'mile' : ['Miles', 1609.34],
    'NM' : ['Nautical miles', 1852],
};

var unitLoadableVariables = {
    // Mass
    'ng' : ['Nanograms', 1e-12],
    'ug' : ['Micrograms', 1e-9],
    'mg' : ['Milligrams', 1e-6],
    'g' : ['Grams', 1e-3],
    'kg' : ['Kilograms', 1],
    't' : ['Metric tonnes', 1e3],
    'Mg' : ['Megagrams', 1e6],
    'Mg' : ['Gigabrams', 1e9],

    'oz' : ['Ounces', 0.0283495],
    'lb' : ['Pounds', 0.453592],
    'ton' : ['US (short) tons', 907.18],

    // Volume
    'floz' : ['Fluid ounces', 0.0295735e-3],
    'qt' : ['Quarts', 0.946353e-3],
    'gal' : ['US gallons', 3.78541e-3],

    'ul' : ['Microlitres', 1e-9],
    'ml' : ['Millilitres', 1e-6],
    'l' : ['Litres', 1e-3],
    'kl' : ['Kilolitres', 1],
    'Ml' : ['Megalitres', 1e3],
    'gl' : ['Gigalitres', 1e6],

    // Force
    'lbf' : ['Pounds-force', 4.44822],
    'kgf' : ['Kilograms-force', 9.80665],
    'N' : ['Newtons', 1],

    // Extra length units that would be ridiculous to have squared and cubed versions

    'ls' : ['Light seconds', 299792458],
    'ly' : ['Light years', 9.4607e15],

    // Velocity
    'mps' : ['Metres per second', 1],
    'm_s' : ['Metres per second', 1],
    'kms' : ['Kilometers per second', 1e3],
    'kmh' : ['Kilometers per hour', 1/3.6],
    'mph' : ['Miles per hour', 1/2.23694],
    'fps' : ['Feet per second', 1/0.3048],
    'kt' : ['Knots', 1/1.852],

    // Time
    'ns' : ['Nanoseconds', 1e-9],
    'us' : ['Microeconds', 1e-6],
    'ms' : ['Millieconds', 1e-3],
    's' : ['Seconds', 1],
    'min' : ['Minutes', 60],
    'hr' : ['Hours', 60 * 60],
    'day' : ['Days', 60 * 60 * 24],
    'yr' : ['Years (averaged over leap years)', 60 * 60 * 24 * 365.2425],

    // Frequency

    'nhz' : ['Nanohertz', 1e-9],
    'uhz' : ['Microhertz', 1e-6],
    'mhz' : ['Megahertz', 1e-3],
    'hz' : ['Hertz', 1],
    'hkz' : ['Kilohertz', 1e3],
    'Mhz' : ['Megahertz', 1e6],
    'ghz' : ['Gigahertz', 1e9],
    'thz' : ['Terahertz', 1e12],

    // Angle (note: these expect the calculator to be in radians mode)
    
    'rd' : ['Radians', 1],
    'rad' : ['Radians', 1],
    'rev' : ['Revolutions', Math.PI * 2],
    'deg' : ['Degrees', Math.PI / 180],
    'amin' : ['Arc-minutes', Math.PI / 180 / 60],
    'arcmin' : ['Arc-minutes', Math.PI / 180 / 60],
    'asec' : ['Arc-seconds', Math.PI / 180 / 3600],
    'arcsec' : ['Arc-seconds', Math.PI / 180 / 3600],
    'grad' : ['Gradians', Math.PI / 200],
    'gon' : ['Gradians', Math.PI / 200],

    // Angular velocity

    'rads' : ['Radians per second', 1],
    'radm' : ['Radians per minute', 1 / 60],
    'radh' : ['Radians per hour', 1 / 3600],

    'rps' : ['Revolutions per second', Math.PI * 2],
    'rpm' : ['Revolutions per minute', Math.PI * 2 / 60],
    'rph' : ['Revolutions per hour', Math.PI * 2 / 3600],

    'degs' : ['Degrees per second', 180 / Math.PI],
    'degm' : ['Degrees per minute', 180 / Math.PI / 60],
    'degh' : ['Degrees per hour', 180 / Math.PI / 3600],

    'grads' : ['Gradians per second', 200 / Math.PI],
    'gradm' : ['Gradians per minute', 200 / Math.PI / 60],
    'gradh' : ['Gradians per hour', 200 / Math.PI / 3600],

    'gons' : ['Gradians per second', 200 / Math.PI],
    'gonm' : ['Gradians per minute', 200 / Math.PI / 60],
    'gonh' : ['Gradians per hour', 200 / Math.PI / 3600],
};

for (var key in baseLengthUnits) {
    var name = baseLengthUnits[key][0];
    var value = baseLengthUnits[key][1];
    // Make base units
    unitLoadableVariables[key] = [name, value];
    // Make square units
    unitLoadableVariables[key + '2'] = [name + ' squared', value ** 2];
    // Make cubic units
    unitLoadableVariables[key + '3'] = [name + ' cubed', value ** 3];
}

loadables.unit = new CustomLoadable(
    'Units of measurement', 
    'Variables defining ratios to the SI units of measurement, that can be used like "3 $in"',
    unitLoadableVariables,
    {
        'to' : ['Convert from internal units (SI) to a different unit system (value, target unit)', '$0 / $1'],
        'from' : ['Convert from a unit system to SI internal units (value, source unit)', '$0 * $1'],
        'convert' : ['Convert  between two unit systems (value, source unit, target unit)', '$0 * $1 / $2']
    });
