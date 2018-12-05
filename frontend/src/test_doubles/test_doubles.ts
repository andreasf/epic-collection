import {
    Action,
    History,
    Href,
    Location as RouterLocation,
    LocationDescriptorObject,
    LocationListener,
    Path,
    TransitionPromptHook,
    UnregisterCallback
} from "history";
import LocationState = History.LocationState;

export class NiceHistory implements History {
    public action: Action;
    public length: number;
    public location: RouterLocation;

    public block(prompt?: boolean | string | TransitionPromptHook): UnregisterCallback {
        throw new Error("not implemented");
    }

    public createHref(location: LocationDescriptorObject): Href {
        throw new Error("not implemented");
    }

    public go(n: number): void {
        throw new Error("not implemented");
    }

    public goBack(): void {
        throw new Error("not implemented");
    }

    public goForward(): void {
        throw new Error("not implemented");
    }

    public listen(listener: LocationListener): UnregisterCallback {
        throw new Error("not implemented");
    }

    public push(path: Path, state?: LocationState): void;
    public push(location: LocationDescriptorObject): void;
    public push(path: Path | LocationDescriptorObject, state?: LocationState): void {
        // empty
    }

    public replace(path: Path, state?: LocationState): void;
    public replace(location: LocationDescriptorObject): void;
    public replace(path: Path | LocationDescriptorObject, state?: LocationState): void {
        // empty
    }

}

export class NiceLocation implements Location {
    public hash: string;
    public host: string;
    public hostname: string;
    public href: string;
    public readonly origin: string;
    public pathname: string;
    public port: string;
    public protocol: string;
    public search: string;

    public assign(url: string): void {
        // empty
    }

    public reload(forcedReload?: boolean): void {
        // empty
    }

    public replace(url: string): void {
        // empty
    }

    public toString(): string {
        return "";
    }
}
