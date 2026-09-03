"use client";

import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

export interface ScreenLoaderProps {
  // Loader appearance
  loaderSize?: number; // Size of the moving square
  loaderColor?: string; // Color of the moving square

  // Container dimensions (where the loader will travel)
  // These props will be used to calculate the path.
  // The parent component rendering this loader should have these dimensions
  // and typically 'position: relative'.
  containerWidth: number;
  containerHeight: number;

  // Animation behavior
  durationInFrames?: number; // Duration for one full loop
  loop?: boolean; // Whether the animation should loop
  variant?: "single" | "double"; // Added variant prop
}

export default function ScreenLoader({
  loaderSize = 20,
  loaderColor = "blue",
  containerWidth,
  containerHeight,
  durationInFrames = 120,
  loop = true,
  variant = "single", // Default to single
}: ScreenLoaderProps) {
  const frame = useCurrentFrame();

  const s2 = loaderSize / 2;

  // Define effective corner points for the centerline, inset by s2
  const x0_eff = s2;
  const y0_eff = s2;
  const x1_eff = containerWidth - s2;
  const y1_eff = containerHeight - s2;

  // Path lengths for travel, based on dimensions available for centerline movement
  const L1 = containerWidth - loaderSize;
  const L2 = containerHeight - loaderSize;
  const L3 = containerWidth - loaderSize;
  const L4 = containerHeight - loaderSize;

  // Prevent negative lengths if loaderSize is too large
  const L1_safe = Math.max(0, L1);
  const L2_safe = Math.max(0, L2);
  const L3_safe = Math.max(0, L3);
  const L4_safe = Math.max(0, L4);
  const totalPerimeterPathLength = L1_safe + L2_safe + L3_safe + L4_safe;

  const progress = React.useMemo(() => {
    const currentFrameInCycle = loop
      ? frame % durationInFrames
      : Math.min(frame, durationInFrames - 1);
    // Avoid division by zero if path is zero length
    if (totalPerimeterPathLength === 0 && variant === "single") return 0;
    // For double variant, pathSegmentLength could also be 0, handled in calculatePolylinePoints
    return interpolate(currentFrameInCycle, [0, durationInFrames - 1], [0, 1], {
      extrapolateRight: "clamp",
      easing: Easing.linear,
    });
  }, [frame, durationInFrames, loop, totalPerimeterPathLength, variant]);

  if (containerWidth < loaderSize || containerHeight < loaderSize) {
    console.warn(
      "ScreenLoader: containerWidth or containerHeight is smaller than loaderSize. Loader might not render correctly or be visible."
    );
  }

  const calculatePolylinePoints = (
    currentProg: number,
    startCorner:
      | "topLeft"
      | "bottomRight"
      | "topRight"
      | "bottomLeft"
      | "topLeftSingle"
  ): string => {
    const pathSegmentLength = L1_safe + L2_safe;
    const currentDistance =
      pathSegmentLength > 0 ? currentProg * pathSegmentLength : 0;
    const totalDistSingle =
      totalPerimeterPathLength > 0 ? currentProg * totalPerimeterPathLength : 0;

    const points: { x: number; y: number }[] = [];

    if (startCorner === "topLeft") {
      const P0 = { x: x0_eff, y: y0_eff };
      const P1 = { x: x1_eff, y: y0_eff };
      const P2 = { x: x1_eff, y: y1_eff };

      points.push(P0);
      if (currentDistance <= L1_safe) {
        points.push({ x: x0_eff + currentDistance, y: y0_eff });
      } else if (currentDistance <= L1_safe + L2_safe) {
        points.push(P1);
        points.push({ x: P1.x, y: y0_eff + (currentDistance - L1_safe) });
      } else {
        points.push(P1);
        points.push(P2);
      }
    } else if (startCorner === "bottomRight") {
      const P0 = { x: x1_eff, y: y1_eff };
      const P1 = { x: x0_eff, y: y1_eff };
      const P2 = { x: x0_eff, y: y0_eff };

      points.push(P0);
      if (currentDistance <= L3_safe) {
        points.push({ x: x1_eff - currentDistance, y: P0.y });
      } else if (currentDistance <= L3_safe + L4_safe) {
        points.push(P1);
        points.push({ x: P1.x, y: y1_eff - (currentDistance - L3_safe) });
      } else {
        points.push(P1);
        points.push(P2);
      }
    } else if (startCorner === "topLeftSingle") {
      const P0_s = { x: x0_eff, y: y0_eff };
      const P1_s = { x: x1_eff, y: y0_eff };
      const P2_s = { x: x1_eff, y: y1_eff };
      const P3_s = { x: x0_eff, y: y1_eff };

      points.push(P0_s);
      if (totalDistSingle <= L1_safe) {
        points.push({ x: x0_eff + totalDistSingle, y: y0_eff });
      } else if (totalDistSingle <= L1_safe + L2_safe) {
        points.push(P1_s);
        points.push({ x: P1_s.x, y: y0_eff + (totalDistSingle - L1_safe) });
      } else if (totalDistSingle <= L1_safe + L2_safe + L3_safe) {
        points.push(P1_s);
        points.push(P2_s);
        points.push({
          x: x1_eff - (totalDistSingle - (L1_safe + L2_safe)),
          y: P2_s.y,
        });
      } else if (totalDistSingle <= L1_safe + L2_safe + L3_safe + L4_safe) {
        points.push(P1_s);
        points.push(P2_s);
        points.push(P3_s);
        points.push({
          x: P3_s.x,
          y: y1_eff - (totalDistSingle - (L1_safe + L2_safe + L3_safe)),
        });
      } else if (totalPerimeterPathLength > 0) {
        points.push(P1_s, P2_s, P3_s, P0_s);
      }
      // If path length is zero, P0_s is already pushed. If it needs to be a dot, add P0_s again.
      if (totalPerimeterPathLength === 0 && points.length === 1) {
        points.push(P0_s);
      }
    }

    // Ensure a drawable line if only one point and path is possible, or a dot if path is zero.
    if (points.length === 1) {
      if (
        (startCorner === "topLeftSingle" && totalPerimeterPathLength > 0) ||
        (variant === "double" && pathSegmentLength > 0)
      ) {
        const lastPoint = points[0];
        points.push({ x: lastPoint.x + 0.001, y: lastPoint.y + 0.001 }); // Tiny segment
      } else {
        // Path length is 0, make it a dot by repeating the point
        points.push(points[0]);
      }
    } else if (points.length === 0) {
      // Should only happen if containerSize < loaderSize for all paths
      const fallbackX = containerWidth / 2;
      const fallbackY = containerHeight / 2;
      points.push(
        { x: fallbackX, y: fallbackY },
        { x: fallbackX, y: fallbackY }
      );
    }

    return points.map((p) => `${p.x},${p.y}`).join(" ");
  };

  const polylinePointsString1 =
    variant === "double"
      ? calculatePolylinePoints(progress, "topLeft")
      : calculatePolylinePoints(progress, "topLeftSingle");

  const polylinePointsString2 =
    variant === "double"
      ? calculatePolylinePoints(progress, "bottomRight")
      : "";

  return (
    <svg width={containerWidth} height={containerHeight}>
      <polyline
        points={polylinePointsString1}
        fill="none"
        stroke={loaderColor}
        strokeWidth={loaderSize}
        strokeLinecap="square"
        strokeLinejoin="miter"
        shape-rendering="crispEdges"
      />
      {variant === "double" && polylinePointsString2 && (
        <polyline
          points={polylinePointsString2}
          fill="none"
          stroke={loaderColor}
          strokeWidth={loaderSize}
          strokeLinecap="square"
          strokeLinejoin="miter"
          shape-rendering="crispEdges"
        />
      )}
    </svg>
  );
}
