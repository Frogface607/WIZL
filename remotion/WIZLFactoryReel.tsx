import {
  AbsoluteFill,
  Img,
  Sequence,
  Video,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig
} from "remotion";

type FactoryManifest = {
  title: string;
  subtitle?: string;
  durationSeconds?: number;
  paths: {
    postDir?: string;
    startImage?: string;
    loopVideo?: string;
    editVideo?: string;
  };
  render?: {
    fps?: number;
    width?: number;
    height?: number;
  };
  source?: {
    shop?: string;
    world?: string;
    action?: string;
  };
};

export type WIZLFactoryReelProps = {
  manifest: FactoryManifest;
  hasStartImage?: boolean;
  hasLoopVideo?: boolean;
};

export const WIZLFactoryReel = ({
  manifest,
  hasStartImage = false,
  hasLoopVideo = false
}: WIZLFactoryReelProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const fadeOut = interpolate(frame, [durationInFrames - 24, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });
  const zoom = interpolate(frame, [0, durationInFrames], [1.02, 1.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  const loopVideo = hasLoopVideo ? asset(manifest.paths.loopVideo, manifest.paths.postDir) : null;
  const startImage = hasStartImage ? asset(manifest.paths.startImage, manifest.paths.postDir) : null;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0B1218", fontFamily: "Arial, sans-serif" }}>
      <AbsoluteFill>
        {loopVideo ? (
          <Video
            src={loopVideo}
            muted
            loop
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${zoom})`
            }}
          />
        ) : startImage ? (
          <Img
            src={startImage}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${zoom})`
            }}
          />
        ) : (
          <AbsoluteFill
            style={{
              background:
                "radial-gradient(circle at 50% 38%, #24352B 0%, #111B22 42%, #0B1218 100%)"
            }}
          />
        )}
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(11,18,24,0.72) 0%, rgba(11,18,24,0.12) 38%, rgba(11,18,24,0.9) 100%)"
        }}
      />

      <Sequence from={8}>
        <AbsoluteFill
          style={{
            opacity: fadeIn * fadeOut,
            padding: 72,
            justifyContent: "space-between"
          }}
        >
          <div
            style={{
              color: "#99F788",
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase"
            }}
          >
            WIZL
          </div>

          <div style={{ maxWidth: 820 }}>
            <div
              style={{
                color: "#F2E8D4",
                fontSize: 82,
                lineHeight: 0.94,
                fontWeight: 900
              }}
            >
              {manifest.title}
            </div>
            {manifest.subtitle ? (
              <div
                style={{
                  color: "#CE8E58",
                  fontSize: 34,
                  lineHeight: 1.15,
                  fontWeight: 700,
                  marginTop: 24
                }}
              >
                {manifest.subtitle}
              </div>
            ) : null}
            <div
              style={{
                color: "rgba(242,232,212,0.74)",
                fontSize: 26,
                lineHeight: 1.3,
                marginTop: 28,
                maxWidth: 680
              }}
            >
              wizl.space
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

function asset(value?: string, postDir?: string) {
  if (!value) {
    return "";
  }
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  const normalized = value.replaceAll("\\", "/");
  const normalizedPostDir = postDir?.replaceAll("\\", "/").replace(/\/$/, "");

  if (normalizedPostDir && normalized.startsWith(`${normalizedPostDir}/`)) {
    return staticFile(normalized.slice(normalizedPostDir.length + 1));
  }

  if (!normalized.includes("/")) {
    return staticFile(normalized);
  }

  return staticFile(normalized);
}
