import * as React from "react";
import {ReactNode} from "react";
import {Album, LibraryService} from "../spotify/LibraryService";
import {Spinner} from "../components/Spinner";
import "./AlbumPage.css";
import {ErrorMessageService} from "../errors/ErrorMessageService";
import {History} from "history";


interface AlbumPageProps {
    errorMessageService: ErrorMessageService;
    libraryService: LibraryService;
    history: History;
}

interface AlbumPageState {
    album: Album;
    loading: boolean;
    coverLoading: boolean;
}

const emptyAlbum = {
    name: "",
    artists: "",
    cover: "",
    id: "",
    tracks: 0,
} as Album;

export class AlbumPage extends React.Component<AlbumPageProps, AlbumPageState> {

    constructor(props: AlbumPageProps, context?: any) {
        super(props, context);

        this.state = {
            album: emptyAlbum,
            loading: true,
            coverLoading: true,
        };
    }

    public async componentDidMount() {
        await this.loadAlbum();
    }

    public render(): ReactNode {
        const loading = this.state.loading || this.state.coverLoading;
        const spinner = loading ? <Spinner/> : null;

        return (
            <div className="album-page">
                <div className="action-bar">
                    <div className="back-button" onClick={() => this.onBackClicked()}>back</div>
                    <div className="selected-count">
                        <span className="count">{this.props.libraryService.getSelectedCount()}</span> tracks selected
                    </div>
                </div>
                <div className="album">
                    {spinner}
                    <div className="album-cover">
                        <img src={this.state.album.cover} onLoad={() => this.coverLoaded()}/>
                    </div>
                    <div className="album-name">{this.state.album.name}</div>
                    <div className="album-artists">{this.state.album.artists}</div>
                </div>
                <div className="buttons">
                    <div className="remove">
                        <button className="remove-album"
                                onClick={() => this.onRemoveAlbumClicked()}
                                disabled={loading}>
                            select for removal
                        </button>
                    </div>
                    <div className="keep">
                        <button className="keep-album"
                                onClick={() => this.onKeepAlbumClicked()}
                                disabled={loading}>
                            keep
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    private async loadAlbum() {
        try {
            this.setState({
                loading: true,
                coverLoading: true
            });

            const album = await this.props.libraryService.getRandomAlbum();

            this.setState({
                album,
                loading: false,
            });

        } catch (e) {
            this.props.errorMessageService.show(`error retrieving album: ${e.message}`);
        }
    }

    private coverLoaded() {
        this.setState({
            coverLoading: false
        });
    }

    private onBackClicked() {
        this.props.libraryService.clearSelection();
        this.props.history.push("/");
    }

    private onRemoveAlbumClicked() {
        this.props.libraryService.selectForRemoval(this.state.album);
        return this.loadAlbum();
    }

    private onKeepAlbumClicked() {
        return this.loadAlbum();
    }
}