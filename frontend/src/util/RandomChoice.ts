export class RandomChoice {
    private math: Math;

    constructor(math: Math) {
        this.math = math;
    }

    public randomInt(upperBound: number, exclude: number[]): number {
        const maxRandomInt = upperBound - 1 - exclude.length;

        if (maxRandomInt < 0) {
            throw new Error("library empty or all albums viewed. " +
                "after closing this dialog, select 'move' to move all selected albums " +
                "or 'back' to clear the current selection.");
        }

        let randomInt = this.math.round(this.math.random() * maxRandomInt);

        // never exceeds the upper bound:
        // - if there is at least 1 non-excluded number after an excluded section, the loop will stop there:
        //   [0, 1, X, X, X, 5]
        // - if there is no non-excluded number at the upper bound, the initial randomInt will never be picked in
        //   the excluded section. instead, either a non-excluded number is picked directly, or there is
        //   (by definition) another non-excluded one after the initial pick: [0, 1, 2, 3, X, X] or [0, 1, X, 3, X, X]

        while (exclude.indexOf(randomInt) !== -1) {
            randomInt++;
        }

        return randomInt;
    }
}