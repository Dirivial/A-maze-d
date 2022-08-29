import { useState, useEffect, useRef, useCallback } from "react";

import { MazeGenerator, GeneratedCell } from "./MazeGenerator";
import { MazeSolver } from "./MazeSolver";

type MazeProps = {
  width: number;
  height: number;
};

const Maze = ({ width, height }: MazeProps) => {
  console.log("Rendering maze");
  const [size, setSize] = useState({
    width: width * 1.75 + "rem",
    height: height * 1.75 + "rem",
  });

  let maze: GeneratedCell[][] = [];
  //const [maze, setMaze] = useState<GeneratedCell[][]>([]);
  const [mode, setMode] = useState<number>(0);

  useEffect(() => {
    setSize({ width: width * 1.75 + "rem", height: height * 1.75 + "rem" });
  }, [width, height]);

  return (
    <div className="rounded justify-center items-center flex flex-col bg-slate-500 p-2 border border-slate-600 ring-2">
      <div className="flex flex-wrap p-3 gap-2 items-center">
        <button
          onClick={() => setMode(0)}
          className={"p-1 rounded" + (mode ? "  bg-blue-400" : "  bg-blue-600")}
        >
          Maze Generator
        </button>
        <div className="p2" />
        <button
          onClick={() => setMode(1)}
          className={"p-1 rounded" + (mode ? "  bg-blue-600" : "  bg-blue-400")}
        >
          Maze Solver
        </button>
      </div>
      {mode === 0 ? (
        <MazeGenerator
          width={width}
          height={height}
          sizeW={size.width}
          sizeH={size.height}
          setMaze={(generatedMaze: GeneratedCell[][]) => (maze = generatedMaze)}
        />
      ) : (
        <MazeSolver
          width={width}
          height={height}
          sizeW={size.width}
          sizeH={size.height}
          generatedMaze={() => maze}
        />
      )}
    </div>
  );
};

export default Maze;
