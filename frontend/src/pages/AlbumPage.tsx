import * as React from "react";
import {ReactNode} from "react";
import {Album, LibraryService} from "../spotify/LibraryService";
import {Spinner} from "../components/Spinner";
import "./main.css";
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
    tracks: [],
    offset: -1,
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
        const coverClass = loading ? "loading" : "";

        return (
            <div className="album-page">
                <div className="action-bar">
                    <button className="back-button" onClick={() => this.onBackClicked()}>back</button>
                    <div className="selected-count">
                        <span className="count">{this.props.libraryService.getSelectedCount()}</span> selected
                    </div>
                    <button className="move-button" onClick={() => this.onMoveClicked()}>move</button>
                </div>
                <div className="album">
                    <div className="album-cover">
                        {spinner}
                        <img className={coverClass} src={this.state.album.cover} onLoad={() => this.coverLoaded()}/>
                    </div>
                    <div className="album-name">{this.state.album.name}</div>
                    <div className="album-artists">{this.state.album.artists}</div>
                </div>
                <div className="buttons">
                    <button className="select"
                            onClick={() => this.onSelectClicked()}
                            disabled={loading}>
                        select for moving
                    </button>
                    <button className="keep"
                            onClick={() => this.onKeepClicked()}
                            disabled={loading}>
                        keep
                    </button>
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
            this.props.errorMessageService.show(`error retrieving next album: ${e.message}`);
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

    private onSelectClicked() {
        this.props.libraryService.selectForMoving(this.state.album);
        return this.loadAlbum();
    }

    private onKeepClicked() {
        this.props.libraryService.keepAlbum(this.state.album);
        return this.loadAlbum();
    }

    private onMoveClicked() {
        this.props.history.push("/confirm-moving");
    }
}