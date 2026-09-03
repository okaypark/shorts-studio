import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(2);
Config.setCodec("h264");
Config.setCrf(20);

// 렌더 결과물은 out/ 에 쌓입니다. (git에 올라가지 않습니다)
Config.setOutputLocation("out/video.mp4");
