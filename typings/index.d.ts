export interface KarmaTypescriptConfig {
    bundlerOptions?: BundlerOptions;
    compilerOptions?: CompilerOptions;
    coverageOptions?: CoverageOptions;
    exclude?: string[];
    include?: string[];
    remapOptions?: RemapOptions;
    reports?: Reports;
    transformPath?: Function;
    transforms?: Function[];
    tsconfig: string;
}

export interface BundlerOptions {
    addNodeGlobals?: boolean;
    entrypoints?: RegExp;
    exclude?: string[];
    ignore?: string[];
    noParse?: string[];
    resolve?: Resolve;
    validateSyntax?: boolean;
}

export interface Resolve {
    alias?: {};
    extensions?: string[];
    directories?: string[];
}

export interface CompilerOptions {
    [key:string]: any;
}

export interface CoverageOptions {
    instrumentation?: boolean;
    exclude?: RegExp | RegExp[];
}

export interface RemapOptions {
    exclude?: RegExp;
    warn?: Function;
}

export interface Reports {
    clover?: string | Destination;
    cobertura?: string | Destination;
    html?: string | Destination;
    "json-summary"?: string | Destination;
    json?: string | Destination;
    lcovonly?: string | Destination;
    teamcity?: string | Destination;
    "text-lcov"?: string | Destination;
    "text-summary"?: string | Destination;
    text?: string | Destination;
}

export interface Destination {
    directory?: string;
    filename?: string;
    subdirectory?: string;
}
