import { useMemo, useState } from "react";
import { Cell } from "./cell";
import { GeneratedCell } from "./MazeGenerator";

export type MazeSolverProps = {
  width: number;
  height: number;
  sizeW: string;
  sizeH: string;
  generatedMaze: () => GeneratedCell[][];
};

type SpecialCell = {
  x: number;
  y: number;
  index: number;
};

export const MazeSolver = ({
  width,
  height,
  sizeW,
  sizeH,
  generatedMaze,
}: MazeSolverProps) => {
  const [maze, setMaze] = useState<GeneratedCell[][]>([]);
  const [entrance, setEntrance] = useState<SpecialCell>();
  const [exit, setExit] = useState<SpecialCell>();

  useMemo(() => {
    setMaze([...generatedMaze()]);
  }, [generatedMaze]);

  const updateEntrance = (x: number, y: number, index: number) => {
    if (maze === undefined) return;
    for (let i = -1; i < 2; i += 2) {
      if (maze[y + i]) {
        if (maze[y + i]![x]!.visited) {
          setEntrance({ x, y, index });
        }
      }
      if (maze[y]![x + i]) {
        if (maze[y]![x + i]!.visited) {
          setEntrance({ x, y, index });
        }
      }
    }
  };

  const updateExit = (x: number, y: number, index: number) => {
    if (maze === undefined) return;
    for (let i = -1; i < 2; i += 2) {
      if (maze[y + i]) {
        if (maze[y + i]![x]!.visited) {
          setExit({ x, y, index });
        }
      }
      if (maze[y]![x + i]) {
        if (maze[y]![x + i]!.visited) {
          setExit({ x, y, index });
        }
      }
    }
  };

  return (
    <div>
      <div>
        {" "}
        <button
          onClick={() => {
            console.log(generatedMaze());
          }}
          className="p-1 rounded bg-blue-400"
        >
          Solve maze
        </button>
      </div>{" "}
      <div className="border rounded border-blue-300">
        <div
          style={{ width: sizeW, height: sizeH }}
          className="bg-gray-600 rounded"
        >
          {maze?.flat().map((cell, index) => {
            return (
              <Cell
                key={index}
                path={cell.visited}
                solution={false}
                isEntrance={false}
                isExit={false}
                updateExit={() => null}
                updateEntrance={() => null}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
