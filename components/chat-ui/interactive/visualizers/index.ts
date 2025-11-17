import TwoPointerVisualizer from "./TwoPointerVisualizer";
import SlidingWindowVisualizer from "./SlidingWindowVisualizer";

export const VISUALIZERS = {
  "two-pointer": TwoPointerVisualizer,
  "sliding-window": SlidingWindowVisualizer,
} as const;

export type VisualizerType = keyof typeof VISUALIZERS;
