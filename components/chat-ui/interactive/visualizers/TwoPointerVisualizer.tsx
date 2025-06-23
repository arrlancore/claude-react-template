import React from "react";

interface TwoPointerState {
  array: number[];
  left: number;
  right: number;
  target?: number;
  currentSum?: number;
  status?: string;
}

interface TwoPointerVisualizerProps {
  state: TwoPointerState;
}

const TwoPointerVisualizer: React.FC<TwoPointerVisualizerProps> = ({ state }) => {
  const { array, left, right, target, currentSum, status } = state;

  return (
    <div>
      <div className="flex justify-center items-center mb-4">
        <div className="flex gap-2">
          {array.map((value, index) => {
            const isLeft = index === left;
            const isRight = index === right;
            const isHighlighted = isLeft || isRight;

            return (
              <div
                key={index}
                className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isLeft
                    ? "bg-blue-500 text-white scale-110"
                    : isRight
                    ? "bg-pink-500 text-white scale-110"
                    : "bg-slate-100 text-slate-700"
                } ${isHighlighted ? "shadow-lg" : ""}`}
              >
                {value}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-8 mb-4">
        <div className="text-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
          <span className="text-xs text-slate-600">Left: {array[left]}</span>
        </div>
        <div className="text-center">
          <div className="w-3 h-3 bg-pink-500 rounded-full mx-auto mb-1"></div>
          <span className="text-xs text-slate-600">Right: {array[right]}</span>
        </div>
      </div>

      {(target !== undefined || currentSum !== undefined) && (
        <div className="bg-slate-100 rounded-lg p-3 text-center">
          {target !== undefined && currentSum !== undefined && (
            <div className="text-sm">
              <span className="text-slate-600">Sum: </span>
              <span className="font-medium">{currentSum}</span>
              <span className="text-slate-600"> | Target: </span>
              <span className="font-medium">{target}</span>
              <span className={`ml-2 font-medium ${
                currentSum === target ? "text-green-600" :
                currentSum > target ? "text-red-600" : "text-orange-600"
              }`}>
                {currentSum === target ? "Found!" :
                 currentSum > target ? "Too High" : "Too Low"}
              </span>
            </div>
          )}
          {status && (
            <div className="text-xs text-slate-500 mt-1">{status}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TwoPointerVisualizer;
