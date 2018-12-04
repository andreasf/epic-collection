import {configure, shallow} from "enzyme";
import * as React from "react";
import * as Adapter from "enzyme-adapter-react-16";
import {MainPage} from "./MainPage";
import {ApiClient} from "../spotify/ApiClient";
import {instance, mock, when} from "ts-mockito";

configure({adapter: new Adapter()});

describe("MainPage", () => {
    let apiClient: ApiClient;

    beforeEach(() => {
        apiClient = mock(ApiClient);
    });

    it("shows the current username and track count", async () => {
        const getUsernamePromise = Promise.resolve("expected username");
        const getTrackCountPromise = Promise.resolve(2342);
        when(apiClient.getUsername()).thenReturn(getUsernamePromise);
        when(apiClient.getTrackCount()).thenReturn(getTrackCountPromise);

        const wrapper = shallow(<MainPage apiClient={instance(apiClient)}/>);
        await getUsernamePromise;
        await getTrackCountPromise;

        expect(wrapper.find('.username').text()).toEqual("expected username");
        expect(wrapper.find('.track-count').text()).toEqual("2342");
    });
});
