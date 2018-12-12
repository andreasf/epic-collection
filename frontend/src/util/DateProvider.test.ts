import {DateProvider} from "./DateProvider";

describe("DateProvider", () => {
    it("returns a new Date", () => {
        const date = new DateProvider().newDate();

        expect(date).toBeInstanceOf(Date);
    });
});