import { useState, useEffect, useRef, useCallback } from "react";
import { number } from "zod";

import { MazeGenerator, GeneratedCell } from "./MazeGenerator";
import { MazeSolver } from "./MazeSolver";

function Maze() {
  const [maze, setMaze] = useState<GeneratedCell[][]>([]);
  const [mode, setMode] = useState<number>(0);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  return (
    <div className="justify-center items-center flex flex-col bg-transparent p-2">
      <div className="flex flex-wrap p-3 gap-2 items-center text-2xl">
        <button
          onClick={() => setMode(0)}
          className={
            "p-2 rounded transition-colors text-gray-100" +
            (mode ? "  bg-transparent hover:bg-slate-600" : "  bg-slate-600")
          }
        >
          Generate
        </button>
        <button
          onClick={() => setMode(1)}
          className={
            "p-2 rounded transition-colors text-gray-100" +
            (mode ? "  bg-slate-600" : "  bg-transparent hover:bg-slate-600")
          }
        >
          Solve
        </button>
      </div>
      {mode === 0 ? (
        <MazeGenerator
          oldDimensions={{ width: dimensions.width, height: dimensions.height }}
          setMazeDimensions={(width: number, height: number) =>
            setDimensions({ width: width, height: height })
          }
          setMaze={(generatedMaze: GeneratedCell[][]) => setMaze(generatedMaze)}
        />
      ) : (
        <MazeSolver width={dimensions.width} generatedMaze={() => maze} />
      )}
    </div>
  );
}

export default Maze;
