import {RandomChoice} from "./RandomChoice";
import {anything, instance, mock, when} from "ts-mockito";
import {BadMath} from "./test_doubles/test_doubles";

describe("RandomChoice", () => {
    let randomChoice: RandomChoice;
    let math: Math;

    beforeEach(() => {
        math = mock(BadMath);
        randomChoice = new RandomChoice(instance(math));

        when(math.random()).thenReturn(0.333);
        when(math.round(anything())).thenCall((args => Math.round(args)));
    });

    it("returns a random integer greater or equal to 0", () => {
        when(math.random()).thenReturn(0);

        const randomInt = randomChoice.randomInt(42, []);

        expect(randomInt).toEqual(0);
    });

    it("returns a random integer less than upperBound", () => {
        when(math.random()).thenReturn(1);

        const randomInt = randomChoice.randomInt(42, []);

        expect(randomInt).toEqual(41);
    });

    it("returns an integer", () => {
        const goodFloat = 23.542 / 41; /// should be 23.542 before rounding

        when(math.random()).thenReturn(goodFloat);

        const randomInt = randomChoice.randomInt(42, []);
        expect(randomInt).toEqual(24);
    });

    it("skips results to exclude", () => {
        const badFloat = 23 / 40; // should give 23
        when(math.random()).thenReturn(badFloat);

        const randomInt = randomChoice.randomInt(42, [23]);

        expect(randomInt).toEqual(24);
    });

    it("throws an error if all possible results are excluded", () => {
        try {
            randomChoice.randomInt(4, [0, 1, 2, 3]);
            fail("should have thrown an error");
        } catch (e) {
            expect(e.message).toEqual("all possible results excluded");
        }
    });
});