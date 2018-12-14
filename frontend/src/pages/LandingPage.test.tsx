import {configure, shallow} from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import {LandingPage} from "./LandingPage";
import * as React from "react";

configure({adapter: new Adapter()});

describe("LandingPage", () => {
    it("it has a link to MainPage", () => {
        const wrapper = shallow(<LandingPage/>);

        expect(wrapper.find(".login a").props()).toHaveProperty("href", "/home");
    });
});