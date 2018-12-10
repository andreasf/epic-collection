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

export class BadMath implements Math {
    public readonly E: number;
    public readonly LN10: number;
    public readonly LN2: number;
    public readonly LOG10E: number;
    public readonly LOG2E: number;
    public readonly PI: number;
    public readonly SQRT1_2: number;
    public readonly SQRT2: number;
    public readonly [Symbol.toStringTag]: "Math";

    public abs(x: number): number {
        return 0;
    }

    public acos(x: number): number {
        return 0;
    }

    public acosh(x: number): number {
        return 0;
    }

    public asin(x: number): number {
        return 0;
    }

    public asinh(x: number): number {
        return 0;
    }

    public atan(x: number): number {
        return 0;
    }

    public atan2(y: number, x: number): number {
        return 0;
    }

    public atanh(x: number): number {
        return 0;
    }

    public cbrt(x: number): number {
        return 0;
    }

    public ceil(x: number): number {
        return 0;
    }

    public clz32(x: number): number {
        return 0;
    }

    public cos(x: number): number {
        return 0;
    }

    public cosh(x: number): number {
        return 0;
    }

    public exp(x: number): number {
        return 0;
    }

    public expm1(x: number): number {
        return 0;
    }

    public floor(x: number): number {
        return 0;
    }

    public fround(x: number): number {
        return 0;
    }

    public hypot(...values: number[]): number {
        return 0;
    }

    public imul(x: number, y: number): number {
        return 0;
    }

    public log(x: number): number {
        return 0;
    }

    public log10(x: number): number {
        return 0;
    }

    public log1p(x: number): number {
        return 0;
    }

    public log2(x: number): number {
        return 0;
    }

    public max(...values: number[]): number {
        return 0;
    }

    public min(...values: number[]): number {
        return 0;
    }

    public pow(x: number, y: number): number {
        return 0;
    }

    public random(): number {
        return 0;
    }

    public round(x: number): number {
        return 0;
    }

    public sign(x: number): number {
        return 0;
    }

    public sin(x: number): number {
        return 0;
    }

    public sinh(x: number): number {
        return 0;
    }

    public sqrt(x: number): number {
        return 0;
    }

    public tan(x: number): number {
        return 0;
    }

    public tanh(x: number): number {
        return 0;
    }

    public trunc(x: number): number {
        return 0;
    }

}
