export class RandomChoice {
    private math: Math;

    constructor(math: Math) {
        this.math = math;
    }

    public randomInt(upperBound: number): number {
        return this.math.round(this.math.random() * (upperBound - 1));
    }
}