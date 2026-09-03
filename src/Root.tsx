import React from "react";
import { Composition } from "remotion";
import { VIDEOS } from "../videos";
import { resolveDuration, resolveFps, resolveSize } from "./lib/video";

/**
 * videos/index.ts 에 등록된 영상이 그대로 컴포지션 목록이 됩니다.
 * 이 파일은 손댈 일이 없습니다.
 */
export const RemotionRoot: React.FC = () => (
  <>
    {VIDEOS.map((video) => {
      const { width, height } = resolveSize(video);
      return (
        <Composition
          key={video.id}
          id={video.id}
          component={video.component}
          durationInFrames={resolveDuration(video)}
          fps={resolveFps(video)}
          width={width}
          height={height}
        />
      );
    })}
  </>
);
