import {Album, LibraryService, LibraryStats} from "./LibraryService";
import {ApiClient} from "./ApiClient";
import {anything, deepEqual, instance, mock, reset, verify, when} from "ts-mockito";
import {ApiAlbum} from "./response_types";
import {RandomChoice} from "../util/RandomChoice";
import {DateProvider} from "../util/DateProvider";

describe("LibraryService", () => {
    let apiClient: ApiClient;
    let dateProvider: DateProvider;
    let libraryService: LibraryService;
    let randomChoice: RandomChoice;

    beforeEach(() => {
        apiClient = mock(ApiClient);
        dateProvider = mock(DateProvider);
        randomChoice = mock(RandomChoice);
        libraryService = new LibraryService(instance(apiClient), instance(randomChoice), instance(dateProvider));
    });

    describe("commit", () => {
        let resolveAddTracks: () => void;
        let addTracksPromise: Promise<void>;

        beforeEach(() => {
            when(dateProvider.newDate()).thenReturn(new Date(2018, 11, 12, 9, 3, 0, 0));
            addTracksPromise = new Promise((resolve) => {
                resolveAddTracks = resolve
            });
        });

        it("creates a new playlist, adds all tracks and finally deletes albums", async () => {
            const createPlaylistPromise = Promise.resolve("playlist-id");
            when(apiClient.createPlaylist(anything(), anything())).thenReturn(createPlaylistPromise);
            when(apiClient.addToPlaylist(anything(), anything())).thenReturn(addTracksPromise);
            when(apiClient.deleteAlbums(anything())).thenResolve();
            const trackUris = [
                "spotify:track:album-1-track-1",
                "spotify:track:album-1-track-2",
                "spotify:track:album-3-track-1",
                "spotify:track:album-3-track-2",
                "spotify:track:album-3-track-3",
            ];

            libraryService.selectForMoving(expectedAlbum1);
            libraryService.selectForMoving(expectedAlbum3);

            const commitPromise = libraryService.commit();

            verify(apiClient.createPlaylist(
                "Epic Collection Dec 12, 2018, 09:03",
                "Tracks moved from library on Dec 12, 2018, 09:03")).once();

            await createPlaylistPromise;
            verify(apiClient.addToPlaylist("playlist-id", deepEqual(trackUris))).once();
            verify(apiClient.deleteAlbums(anything())).never();

            resolveAddTracks();
            await commitPromise;
            verify(apiClient.deleteAlbums(deepEqual(["album-1-id", "album-3-id"]))).once();

            expect(libraryService.getSelectedCount()).toEqual(0);
        });

        it("adds up to 100 tracks at a time", async () => {
            const largeAlbum1 = makeAlbum("album-1", 75);
            const largeAlbum2 = makeAlbum("album-2", 75);
            when(apiClient.createPlaylist(anything(), anything())).thenReturn(Promise.resolve("playlist-id"));
            when(apiClient.addToPlaylist(anything(), anything())).thenResolve();
            when(apiClient.deleteAlbums(anything())).thenResolve();

            libraryService.selectForMoving(largeAlbum1);
            libraryService.selectForMoving(largeAlbum2);

            await libraryService.commit();

            const allUris = trackUrisOf(largeAlbum1).concat(trackUrisOf(largeAlbum2));
            const first100Tracks = allUris.slice(0, 100);
            const next50Tracks = allUris.slice(100, 150);

            verify(apiClient.addToPlaylist("playlist-id", deepEqual(first100Tracks))).once();
            verify(apiClient.addToPlaylist("playlist-id", deepEqual(next50Tracks))).once();
        });

        it("deletes up to 50 albums at a time", async () => {
            const albums: Album[] = [];
            for (let i=0; i<75; i++) {
                albums.push(makeAlbum(`album-${i + 1}`, 1));
            }

            when(apiClient.createPlaylist(anything(), anything())).thenReturn(Promise.resolve("playlist-id"));
            when(apiClient.addToPlaylist(anything(), anything())).thenResolve();
            when(apiClient.deleteAlbums(anything())).thenResolve();

            for (const album of albums) {
                libraryService.selectForMoving(album);
            }

            await libraryService.commit();

            const allAlbumIds = albums.map(album => album.id);
            const first50AlbumIds = allAlbumIds.slice(0, 50);
            const next25AlbumIds = allAlbumIds.slice(50);

            verify(apiClient.deleteAlbums(deepEqual(first50AlbumIds))).once();
            verify(apiClient.deleteAlbums(deepEqual(next25AlbumIds))).once();
        });
    });

    describe("clearSelection", () => {
        it("clears the current selection", () => {
            expect(libraryService.getSelectedCount()).toEqual(0);

            libraryService.selectForMoving(expectedAlbum1);
            expect(libraryService.getSelectedCount()).toEqual(1 + expectedAlbum1.tracks.length);

            libraryService.clearSelection();
            expect(libraryService.getSelectedCount()).toEqual(0);
        });

        it("clears the list of viewed albums", async () => {
            const firstRandomNumber = 3;
            when(randomChoice.randomInt(anything(), anything())).thenReturn(firstRandomNumber);
            when(apiClient.getAlbumCount()).thenReturn(Promise.resolve(23));
            when(apiClient.getAlbumByOffset(anything())).thenReturn(Promise.resolve(apiAlbum1));

            // first call adds entry to visited albums list
            await libraryService.getRandomAlbum();
            verify(randomChoice.randomInt(23, deepEqual([]))).once();

            libraryService.clearSelection();

            // second call after clearSelection() passes empty list to randomInt()
            reset(randomChoice);
            when(randomChoice.randomInt(anything(), anything())).thenReturn(3);
            await libraryService.getRandomAlbum();
            verify(randomChoice.randomInt(23, deepEqual([]))).once();
        });
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
            } as LibraryStats);
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

    describe("getRandomAlbum", () => {
        describe("when the album count is not cached", () => {
            const test = async (apiAlbum: ApiAlbum, expectedAlbum: Album) => {
                const totallyRandomNumber = 5;
                when(apiClient.getAlbumCount()).thenReturn(Promise.resolve(23));
                when(randomChoice.randomInt(anything(), anything())).thenReturn(totallyRandomNumber);
                when(apiClient.getAlbumByOffset(anything())).thenReturn(Promise.resolve(apiAlbum));

                const album = await libraryService.getRandomAlbum();

                verify(apiClient.getAlbumCount()).once();
                verify(randomChoice.randomInt(23, deepEqual([]))).once();
                verify(apiClient.getAlbumByOffset(totallyRandomNumber)).once();
                expect(album).toEqual(expectedAlbum);
            };

            it("retrieves album count and a random album", async () => {
                await test(apiAlbum3, expectedAlbum3);
            });

            it("properly formats albums with 1 artist", async () => {
                await test(apiAlbum1, expectedAlbum1);
            });
        });

        describe("when the album count is cached", () => {
            beforeEach(async () => {
                when(apiClient.getAlbumCount()).thenReturn(Promise.resolve(23));
                when(apiClient.getTrackCount()).thenReturn(Promise.resolve(42));
                await libraryService.getStats();
                reset(apiClient);
            });

            it("does not retrieve the count again", async () => {
                const totallyRandomNumber = 5;
                when(randomChoice.randomInt(anything(), anything())).thenReturn(totallyRandomNumber);
                when(apiClient.getAlbumByOffset(anything())).thenReturn(Promise.resolve(apiAlbum1));

                const album = await libraryService.getRandomAlbum();

                verify(apiClient.getAlbumCount()).never();
                verify(randomChoice.randomInt(23, deepEqual([]))).once();
                verify(apiClient.getAlbumByOffset(totallyRandomNumber)).once();
                expect(album).toEqual(expectedAlbum1);
            });
        });

        it("does not return selected albums again", async () => {
            const firstRandomNumber = 3;
            when(randomChoice.randomInt(anything(), anything())).thenReturn(firstRandomNumber);
            when(apiClient.getAlbumCount()).thenReturn(Promise.resolve(23));
            when(apiClient.getAlbumByOffset(anything())).thenReturn(Promise.resolve(apiAlbum1));

            const firstAlbum = await libraryService.getRandomAlbum();
            verify(randomChoice.randomInt(23, deepEqual([]))).once();
            libraryService.selectForMoving(firstAlbum);

            reset(randomChoice);
            when(randomChoice.randomInt(anything(), anything())).thenReturn(3);
            await libraryService.getRandomAlbum();
            verify(randomChoice.randomInt(23, deepEqual([firstRandomNumber]))).once();
        });

        it("does not return 'kept' albums again", async () => {
            const firstRandomNumber = 3;
            when(randomChoice.randomInt(anything(), anything())).thenReturn(firstRandomNumber);
            when(apiClient.getAlbumCount()).thenReturn(Promise.resolve(23));
            when(apiClient.getAlbumByOffset(anything())).thenReturn(Promise.resolve(apiAlbum1));

            const firstAlbum = await libraryService.getRandomAlbum();
            verify(randomChoice.randomInt(23, deepEqual([]))).once();
            libraryService.keepAlbum(firstAlbum);

            reset(randomChoice);
            when(randomChoice.randomInt(anything(), anything())).thenReturn(3);
            await libraryService.getRandomAlbum();
            verify(randomChoice.randomInt(23, deepEqual([firstRandomNumber]))).once();
        });
    });

    describe("getSelectedCount", () => {
        it("returns the number of selected albums and tracks", () => {
            expect(libraryService.getSelectedCount()).toEqual(0);

            libraryService.selectForMoving(expectedAlbum1);
            expect(libraryService.getSelectedCount()).toEqual(1 + expectedAlbum1.tracks.length);


            libraryService.selectForMoving(expectedAlbum3);
            expect(libraryService.getSelectedCount())
                .toEqual(2 + expectedAlbum1.tracks.length + expectedAlbum3.tracks.length);
        });
    });
});

const expectedAlbum3 = {
    name: "album-name",
    artists: "artist-1, artist-2 & artist-3",
    cover: "http://example.com/image-1.jpg",
    id: "album-3-id",
    tracks: [
        "album-3-track-1",
        "album-3-track-2",
        "album-3-track-3"
    ],
    offset: 5
} as Album;

const apiAlbum3 = {
    id: "album-3-id",
    name: "album-name",
    artists: [
        {name: "artist-1"},
        {name: "artist-2"},
        {name: "artist-3"},
    ],
    images: [
        {
            width: 320,
            height: 240,
            url: "http://example.com/image-1.jpg",
        },
        {
            width: 1024,
            height: 768,
            url: "http://example.com/image-2.jpg",
        }
    ],
    tracks: {
        items: [
            {id: "album-3-track-1",},
            {id: "album-3-track-2",},
            {id: "album-3-track-3",},
        ],
        total: 3
    }
} as ApiAlbum;

const expectedAlbum1 = {
    name: "album-name",
    artists: "artist-1",
    cover: "http://example.com/image-1.jpg",
    id: "album-1-id",
    tracks: [
        "album-1-track-1",
        "album-1-track-2"
    ],
    offset: 5
} as Album;

const apiAlbum1 = {
    id: "album-1-id",
    name: "album-name",
    artists: [
        {name: "artist-1"},
    ],
    images: [
        {
            width: 320,
            height: 240,
            url: "http://example.com/image-1.jpg",
        },
        {
            width: 1024,
            height: 768,
            url: "http://example.com/image-2.jpg",
        }
    ],
    tracks: {
        items: [
            {id: "album-1-track-1",},
            {id: "album-1-track-2",},
        ],
        total: 2
    }
} as ApiAlbum;

const makeAlbum = (id: string, trackCount: number) => {
    const tracks = [];
    for (let i = 0; i < trackCount; i++) {
        tracks.push(`${id}-track-${i + 1}`)
    }

    return {
        id,
        name: "album-1",
        tracks
    } as Album;
};

const trackUrisOf = (album: Album) => {
    return album.tracks.map(trackId => "spotify:track:" + trackId);
};