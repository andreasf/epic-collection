import * as React from "react";
import {ReactNode} from "react";
import {LibraryService} from "../spotify/LibraryService";
import {Spinner} from "../components/Spinner";
import "./AlbumPage.css";

interface AlbumPageProps {
    libraryService: LibraryService;
}

interface AlbumPageState {
    name: string;
    artists: string;
    cover: string;
    id: string;
    loading: boolean;
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
        };
    }

    public async componentDidMount() {
        const album = await this.props.libraryService.getRandomAlbum();

        this.setState({
            name: album.name,
            artists: album.artists,
            cover: album.cover,
            id: album.id,
            loading: false,
        });
    }

    public render(): ReactNode {
        const spinner = this.state.loading ? <Spinner/> : null;

        return (
            <div className="album-page">
                {spinner}
                <div className="top">
                    <div className="album-cover">
                        <img src={this.state.cover}/>
                    </div>
                    <div className="album-name">{this.state.name}</div>
                    <div className="artists">
                        Album by <span className="album-artists">{this.state.artists}</span>
                    </div>
                </div>
            </div>
        );
    }
}