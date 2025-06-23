import React from "react";

interface SlidingWindowState {
  array: number[];
  start: number;
  end: number;
  windowSum?: number;
  target?: number;
  status?: string;
}

interface SlidingWindowVisualizerProps {
  state: SlidingWindowState;
}

const SlidingWindowVisualizer: React.FC<SlidingWindowVisualizerProps> = ({ state }) => {
  const { array, start, end, windowSum, target, status } = state;

  return (
    <div>
      <div className="flex justify-center items-center mb-4">
        <div className="flex gap-2">
          {array.map((value, index) => {
            const inWindow = index >= start && index <= end;
            const isStart = index === start;
            const isEnd = index === end;

            return (
              <div
                key={index}
                className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  inWindow
                    ? "bg-purple-500 text-white"
                    : "bg-slate-100 text-slate-700"
                } ${(isStart || isEnd) ? "scale-110 shadow-lg" : ""}`}
              >
                {value}
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center mb-4">
        <div className="w-4 h-1 bg-purple-500 rounded-full mx-auto mb-1"></div>
        <span className="text-xs text-slate-600">
          Window: [{start}, {end}] (size: {end - start + 1})
        </span>
      </div>

      {(windowSum !== undefined || target !== undefined) && (
        <div className="bg-slate-100 rounded-lg p-3 text-center">
          {windowSum !== undefined && (
            <div className="text-sm">
              <span className="text-slate-600">Window Sum: </span>
              <span className="font-medium">{windowSum}</span>
              {target !== undefined && (
                <>
                  <span className="text-slate-600"> | Target: </span>
                  <span className="font-medium">{target}</span>
                  <span className={`ml-2 font-medium ${
                    windowSum === target ? "text-green-600" :
                    windowSum > target ? "text-red-600" : "text-orange-600"
                  }`}>
                    {windowSum === target ? "Found!" :
                     windowSum > target ? "Too High" : "Too Low"}
                  </span>
                </>
              )}
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

export default SlidingWindowVisualizer;
