declare module "next/dist/lib/metadata/types/metadata-interface.js" {
  export type ResolvingMetadata = unknown;
  export type ResolvingViewport = unknown;
}

declare module "next/dist/build/segment-config/app/app-segment-config.js" {
  export type InstantConfigForTypeCheckInternal = unknown;
}

declare module "next/server.js" {
  export type NextRequest = import("next/server").NextRequest;
  export const NextResponse: typeof import("next/server").NextResponse;
}

declare module "next/types.js" {
  export type ResolvingMetadata = unknown;
  export type ResolvingViewport = unknown;
}
