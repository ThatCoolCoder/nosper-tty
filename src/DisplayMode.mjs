export class AbstractDisplayMode {
    formatNumber() {
        throw new Error('AbstractDisplayMode.formatNumber was not overridden');
    }
}

export class NormalDisplayMode {
    formatNumber(number) {
        return number.toFixed();
    }
}

export class ScientificDisplayMode {
    constructor(precision) {
        this.precision = precision;
    }

    formatNumber(number) {
        return number.toExponential(this.precision);
    }
}