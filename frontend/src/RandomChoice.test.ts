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

        const randomInt = randomChoice.randomInt(42);

        expect(randomInt).toEqual(0);
    });

    it("returns a random integer less than upperBound", () => {
        when(math.random()).thenReturn(1);

        const randomInt = randomChoice.randomInt(42);

        expect(randomInt).toEqual(41);
    });

    it("returns an integer", () => {
        const goodFloat = 23.542 / 41;

        when(math.random()).thenReturn(goodFloat);

        const randomInt = randomChoice.randomInt(42);
        expect(randomInt).toEqual(24);
    });
});