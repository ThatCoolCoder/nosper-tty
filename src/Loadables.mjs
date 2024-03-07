export const loadables = {};

loadables.phys = {
    name: 'Physics utilities',
    description: 'Works nicely with the "unit" loadable',
    variables: {
        'a_grav' : { value: 9.81, description: 'Acceleration due to gravity on earth\'s surface' },
        'G' : { value: 6.6743e-11, description: 'Universal gravitatonal constant' },
        'c' : { value: 299792458, description: 'Speed of light (in metres per second)' },
        'c_elec' : { value: 1.60217663e-19, description: 'Charge of an electron (in coloumbs)' }
    },
    functions: {
        'grav' : { args: ['r', 'm_1', 'm_2'], body: 'G m_1 m_2 / r^2', description: 'Force of gravitational attraction between two objects' },
        'earthrange' : { args: ['v', '_angle'], body: 'v^2 * sin(2 * _angle) / a_grav', description: 'Range of object thrown at an angle, on earth' },
        'range' : { args: ['v', '_angle', 'a_gravity'], body: 'v^2 * sin(2 * _angle) / a_gravity', description: 'Range of thrown object (speed in m/s, angle, gravity)' },
        'weight' : { args: ['m'], body: 'm * a_grav', description: 'Weight of object on earth' },
        'acceldist' : { args: ['v_i', 'a', 't'], body: 'v_i t + 1/2 at^2', description: 'Distance moved by an accelerating object' }
    }
};

loadables.geom = {
    name: 'Geometry - Euclidean', 
    description: 'Does not do much because there is no engine support for vector/coordinate types ',
    variables: {

    },
    functions: {
        'circlearea' : { args: ['r'], body: 'pi r^2', description: 'Area of a circle from its radius'},
        'circlearead' : { args: ['d'], body: 'pi (d/2)^2', description: 'Area of a circle from its diameter' }
    }
};

loadables.misc = {
    name: 'Miscellaneous stuff',
    description: 'Currently a single function, needs expansion',
    variables: {

    },
    functions: {
        'roundto' : { args: ['n', '_places'], body: 'round(n * 10^_places) / 10^_places', description: 'Round a number to n places (number, places)' },
    }
};

loadables.combin = {
    name: 'Combinatorics',
    description: 'Combinations, permutations, etc',
    variables: {

    },
    functions: {
        'npr' : { args: ['n', 'r'], body: 'n!/(n-r)!', description: 'Permutations of n items with r to take' },
        'perm' : { args: ['n', 'r'], body: 'n!/(n-r)!', description: 'Same as npr' },
        'ncr' : { args: ['n', 'r'], body: 'n!//r!(n-r)!', description: 'Combinations of n items with r to take' },
        'combin' : { args: ['n', 'r'], body: 'n!//r!(n-r)!', description: 'Same as ncr' },
    }
};

// Construct unit loadable
// -----------------------

// There are lots of length units and they're very repetitive so we do not manually code all the vars
// perhaps if start up time becomes to slow we could pre-compile these somehow, maybe values in custom file

var baseLengthUnits = {
    // Please order things from small to big, but keep metric and archaic separate
    '_nm' : ['Nanometres', 1e-9],
    '_um' : ['Micrometres', 1e-6],
    '_mm' : ['Millimetres', 1e-3],
    '_cm' : ['Centimetres', 0.01],
    '_dm' : ['Decimetres', 0.1],
    'm' : ['Metres', 1],
    '_km' : ['Kilometres', 1000],
    '_Mm' : ['Megametres', 1e6],
    '_gm' : ['Gigametres', 1e9],

    '_in' : ['Inches', 0.0254],
    '_ft' : ['Feet', 0.3048],
    '_yd' : ['Yards', 0.9144],
    '_fur' : ['Furlongs', 201.168],
    '_le' : ['Leagues', 4.828032e3],
    '_mile' : ['Miles', 1609.34],
    '_NM' : ['Nautical miles', 1852],
};

var unitLoadableVariables = {
    // Mass
    '_ng' : ['Nanograms', 1e-12],
    '_ug' : ['Micrograms', 1e-9],
    '_mg' : ['Milligrams', 1e-6],
    'g' : ['Grams', 1e-3],
    '_kg' : ['Kilograms', 1],
    't' : ['Metric tonnes', 1e3],
    '_Mg' : ['Megagrams', 1e6],
    '_Mg' : ['Gigabrams', 1e9],

    '_oz' : ['Ounces', 0.0283495],
    '_lb' : ['Pounds', 0.453592],
    '_ton' : ['US (short) tons', 907.18],

    // Volume
    '_floz' : ['Fluid ounces', 0.0295735e-3],
    '_qt' : ['Quarts', 0.946353e-3],
    '_gal' : ['US gallons', 3.78541e-3],

    '_ul' : ['Microlitres', 1e-9],
    '_ml' : ['Millilitres', 1e-6],
    'l' :  ['Litres', 1e-3],
    'L' :  ['Litres', 1e-3],
    '_kl' : ['Kilolitres', 1],
    '_Ml' : ['Megalitres', 1e3],
    '_gl' : ['Gigalitres', 1e6],

    // Force
    '_lbf' : ['Pounds-force', 4.44822],
    '_kgf' : ['Kilograms-force', 9.80665],
    'N' : ['Newtons', 1],

    // Extra length units that would be ridiculous to have squared and cubed versions

    '_ls' : ['Light seconds', 299792458],
    '_ly' : ['Light years', 9.4607e15],

    // Velocity
    '_kms' : ['Kilometers per second', 1e3],
    '_kmh' : ['Kilometers per hour', 1/3.6],
    '_mph' : ['Miles per hour', 1/2.23694],
    '_fps' : ['Feet per second', 1/0.3048],
    '_kt' :  ['Knots', 1/1.852],

    // Time
    '_ns' : ['Nanoseconds', 1e-9],
    '_us' : ['Microeconds', 1e-6],
    '_ms' : ['Millieconds', 1e-3],
    's' : ['Seconds', 1],
    '_min' : ['Minutes', 60],
    '_hr' : ['Hours', 60 * 60],
    '_day' : ['Days', 60 * 60 * 24],
    '_yr' : ['Years (averaged over leap years)', 60 * 60 * 24 * 365.2425],

    // Frequency

    '_nhz' : ['Nanohertz', 1e-9],
    '_uhz' : ['Microhertz', 1e-6],
    '_mhz' : ['Megahertz', 1e-3],
    '_hz' :  ['Hertz', 1],
    '_hkz' : ['Kilohertz', 1e3],
    '_Mhz' : ['Megahertz', 1e6],
    '_ghz' : ['Gigahertz', 1e9],
    '_thz' : ['Terahertz', 1e12],

    // Angle (note: these expect the calculator to be in radians mode)
    
    '_rd' : ['Radians', 1],
    '_rad' : ['Radians', 1],
    '_rev' : ['Revolutions', Math.PI * 2],
    '_deg' : ['Degrees', Math.PI / 180],
    '_amin' : ['Arc-minutes', Math.PI / 180 / 60],
    '_arcmin' : ['Arc-minutes', Math.PI / 180 / 60],
    '_asec' : ['Arc-seconds', Math.PI / 180 / 3600],
    '_arcsec' : ['Arc-seconds', Math.PI / 180 / 3600],
    '_grad' : ['Gradians', Math.PI / 200],
    '_gon' : ['Gradians', Math.PI / 200],

    // Angular velocity

    '_rads' : ['Radians per second', 1],
    '_radm' : ['Radians per minute', 1 / 60],
    '_radh' : ['Radians per hour', 1 / 3600],

    '_rps' : ['Revolutions per second', Math.PI * 2],
    '_rpm' : ['Revolutions per minute', Math.PI * 2 / 60],
    '_rph' : ['Revolutions per hour', Math.PI * 2 / 3600],

    '_degs' : ['Degrees per second', 180 / Math.PI],
    '_degm' : ['Degrees per minute', 180 / Math.PI / 60],
    '_degh' : ['Degrees per hour', 180 / Math.PI / 3600],

    '_grads' : ['Gradians per second', 200 / Math.PI],
    '_gradm' : ['Gradians per minute', 200 / Math.PI / 60],
    '_gradh' : ['Gradians per hour', 200 / Math.PI / 3600],

    '_gons' : ['Gradians per second', 200 / Math.PI],
    '_gonm' : ['Gradians per minute', 200 / Math.PI / 60],
    '_gonh' : ['Gradians per hour', 200 / Math.PI / 3600],

    // Electricity
    '_nA' : ['Nanoamps', 1e-9],
    '_uA' : ['Microamps', 1e-6],
    '_mA' : ['Milliamps', 1e-3],
    'A' :  ['Amps', 1],
    '_kA' : ['Kiloamps', 1e3],
    '_MA' : ['Megaamps', 1e6],
    '_gA' : ['Gigaamps', 1e9],
    
    '_nV' : ['Nanovolts', 1e-9],
    '_uV' : ['Microvolts', 1e-6],
    '_mV' : ['Millivolts', 1e-3],
    'V' :  ['Volts', 1],
    '_kV' : ['Kilovolts', 1e3],
    '_MV' : ['Megavolts', 1e6],
    '_gV' : ['Gigavolts', 1e9],

    '_ncol' : ['Millicoloumbs', 1e-9],
    '_ucol' : ['Microcoloumbs', 1e-6],
    '_mcol' : ['Millicoloumbs', 1e-3],
    '_col' :  ['Coloumbs', 1],
    '_kcol' : ['Kilocoloumbs', 1e3],
    '_Mcol' : ['Megacoloumbs', 1e6],
    '_Gcol' : ['Gigacoloumbs', 1e9],
};

for (var key in baseLengthUnits) {
    var name = baseLengthUnits[key][0];
    var value = baseLengthUnits[key][1];
    // Make base units
    unitLoadableVariables[key] = [name, value];
    var baseKey = key.startsWith('_') ? key : '_' + key;
    // Make square units
    unitLoadableVariables[baseKey + '2'] = [name + ' squared', value ** 2];
    // Make cubic units
    unitLoadableVariables[baseKey + '3'] = [name + ' cubed', value ** 3];
}

var newUnitLoadableVariables = {};
for (var key in unitLoadableVariables) {
    newUnitLoadableVariables[key] = { value: unitLoadableVariables[key][1], description: unitLoadableVariables[key][0] };
}

loadables.unit = {
    name: 'Units of measurement', 
    description: 'Variables defining ratios to the SI units of measurement, that can be used like "3 $in"',
    variables: newUnitLoadableVariables,
    functions: {
        'to' : { args: ['_value', '_target_unit'], body: '_value / _target_unit', description: 'Display internal value (using SI units) in different unit system' },
        'from' : { args: ['_value', '_source_unit'], body: '_value * _source_unit', description: 'Convert from a unit system to SI internal units' },
        'convert' : { args: ['_value', '_source_unit', '_target_unit'], body: '', description: 'Convert between two unit systems' }
    }
};
