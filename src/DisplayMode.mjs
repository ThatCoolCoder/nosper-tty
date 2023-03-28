export class AbstractDisplayMode {
    formatNumber() {
        throw new Error('AbstractDisplayMode.formatNumber was not overridden');
    }
}

export class NormalDisplayMode {
    formatNumber(number) {
        return number.toString();
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