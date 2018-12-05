import {LibraryService, LibraryStats} from "./LibraryService";
import {ApiClient} from "./ApiClient";
import {instance, mock, verify, when} from "ts-mockito";

describe("LibraryService", () => {
    let apiClient: ApiClient;
    let libraryService: LibraryService;

    beforeEach(() => {
        apiClient = mock(ApiClient);
        libraryService = new LibraryService(instance(apiClient));
    });

    describe("getStats", () => {
        it("returns album and track counts and remaining items", async () => {
            when(apiClient.getAlbumCount()).thenReturn(Promise.resolve(23));
            when(apiClient.getTrackCount()).thenReturn(Promise.resolve(42));

            const stats = await libraryService.getStats();

            expect(stats).toEqual({
                albums: 23,
                tracks: 42,
                remaining: 10000 - 23 - 42
            } as LibraryStats)
        });
    });

    describe("getUsername", () => {
        it("returns the username", async () => {
            when(apiClient.getUsername()).thenReturn(Promise.resolve("username"));

            const username = await libraryService.getUsername();

            expect(username).toEqual("username");
            verify(apiClient.getUsername()).once();
        });
    });
});