import * as React from "react";
import {ReactNode} from "react";
import {LibraryService} from "../spotify/LibraryService";
import {Spinner} from "../components/Spinner";
import "./AlbumPage.css";
import {ErrorMessageService} from "../errors/ErrorMessageService";

interface AlbumPageProps {
    errorMessageService: ErrorMessageService;
    libraryService: LibraryService;
}

interface AlbumPageState {
    name: string;
    artists: string;
    cover: string;
    id: string;
    loading: boolean;
    coverLoading: boolean;
}

export class AlbumPage extends React.Component<AlbumPageProps, AlbumPageState> {

    constructor(props: AlbumPageProps, context?: any) {
        super(props, context);

        this.state = {
            name: "",
            artists: "",
            cover: "",
            id: "",
            loading: true,
            coverLoading: true
        };
    }

    public async componentDidMount() {
        await this.loadAlbum();
    }

    public render(): ReactNode {
        const spinner = this.state.loading || this.state.coverLoading ? <Spinner/> : null;

        return (
            <div className="album-page">
                {spinner}
                <div className="top">
                    <div className="album-cover">
                        <img src={this.state.cover} onLoad={() => this.coverLoaded()}/>
                    </div>
                    <div className="album-name">{this.state.name}</div>
                    <div className="artists">
                        <span className="album-artists">{this.state.artists}</span>
                    </div>
                </div>
                <div className="remove">
                    <button className="remove-album" onClick={() => this.onRemoveAlbumClicked()}>
                        select for removal
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
                name: album.name,
                artists: album.artists,
                cover: album.cover,
                id: album.id,
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

    private onRemoveAlbumClicked() {

        return this.loadAlbum();
    }
}