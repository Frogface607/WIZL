import { Composition, type CalculateMetadataFunction } from "remotion";
import { WIZLFactoryReel, type WIZLFactoryReelProps } from "./WIZLFactoryReel";

const defaultProps: WIZLFactoryReelProps = {
  hasStartImage: true,
  hasLoopVideo: false,
  manifest: {
    title: "WIZL Field Note",
    subtitle: "Bangkok",
    durationSeconds: 12,
    paths: {
      postDir: "content/posts/2026-05-12-wisdom-terpenes",
      startImage: "content/posts/2026-05-12-wisdom-terpenes/card.png",
      loopVideo: "",
      editVideo: ""
    },
    render: {
      fps: 30,
      width: 1080,
      height: 1920
    },
    source: {
      shop: "WIZL",
      world: "rooftop",
      action: "reading the field notes"
    }
  }
};

const calculateMetadata: CalculateMetadataFunction<WIZLFactoryReelProps> = ({ props }) => {
  const fps = props.manifest.render?.fps || 30;
  const durationSeconds = props.manifest.durationSeconds || 12;

  return {
    durationInFrames: Math.round(durationSeconds * fps),
    fps,
    width: props.manifest.render?.width || 1080,
    height: props.manifest.render?.height || 1920,
    props
  };
};

export const RemotionRoot = () => {
  return (
    <Composition
      id="WIZLFactoryReel"
      component={WIZLFactoryReel}
      durationInFrames={360}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={defaultProps}
      calculateMetadata={calculateMetadata}
    />
  );
};
