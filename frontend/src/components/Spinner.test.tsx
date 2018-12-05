import {configure, shallow} from "enzyme";
import * as React from "react";
import {Spinner} from "./Spinner";
import * as Adapter from "enzyme-adapter-react-16";

configure({adapter: new Adapter()});

describe("Spinner", () => {
    it("indicates something is loading", () => {
        const wrapper = shallow(<Spinner/>);

        expect(wrapper.find("div").exists()).toBeTruthy();
    });
});