import { faColumns } from "@fortawesome/free-solid-svg-icons";
import PreviousMap from "postcss/lib/previous-map";
import { useMemo, useState } from "react";
import { number } from "zod";
import useInterval from "../hooks/useInterval";
import { Cell } from "./cell";
import { GeneratedCell } from "./MazeGenerator";

export type MazeSolverProps = {
  width: number;
  height: number;
  sizeW: string;
  sizeH: string;
  generatedMaze: () => GeneratedCell[][];
};

type SolutionCell = GeneratedCell & {
  solution: boolean;
  marks: number;
};

type Coordinate = {
  x: number;
  y: number;
};

type SpecialCell = Coordinate & {
  index: number;
};

export const MazeSolver = ({
  width,
  height,
  sizeW,
  sizeH,
  generatedMaze,
}: MazeSolverProps) => {
  const [maze, setMaze] = useState<SolutionCell[][]>([]);
  //const [solution, setSolution] = useState<SolutionCell[]>([]);
  const [entrance, setEntrance] = useState<SpecialCell>();
  const [exit, setExit] = useState<SpecialCell>();
  const [done, setDone] = useState(false);

  const [searchHead, setSearchHead] = useState({
    current: { x: 0, y: 0 },
    last: { x: 0, y: 0 },
  });

  useMemo(() => {
    let newMaze: SolutionCell[][] = [];
    let oldMaze: GeneratedCell[][] = generatedMaze();
    oldMaze.forEach((column, index) => {
      newMaze.push([]);
      column.forEach((item) =>
        newMaze[index]?.push({ ...item, solution: false, marks: 0 })
      );
    });
    setMaze(newMaze);
  }, [generatedMaze]);

  // Wait until algorithm is implemented
  //useInterval(() => {}, done ? null : 0);

  const nextMove = () => {};

  const findPossibleMoves = () => {
    let nextMaze = [...maze];
    // Look at the positions up,down,left,right and store them if they are possible paths.
    let current = searchHead.current;
    let last = searchHead.last;
    let highPriority = []; // Cells with no marks
    let lowPriority = []; // Cells with one mark

    for (let i = -1; i < 2; i += 2) {
      if (current.y + i !== last.y && maze[current.y + i]) {
        if (
          maze[current.y + i]![current.x]!.visited &&
          maze[current.y + i]![current.x]!.marks < 2
        ) {
          if (maze[current.y + i]![current.x]!.marks === 0) {
            highPriority.push({ y: current.y + i, x: current.x });
          } else {
            lowPriority.push({ y: current.y + i, x: current.x });
          }
        }
      }
      if (current.x + i !== last.x && maze[current.y]![current.x + i]) {
        if (
          maze[current.y]![current.x + i]!.visited &&
          maze[current.y]![current.x + i]!.marks < 2
        ) {
          if (maze[current.y]![current.x + i]!.marks === 0) {
            highPriority.push({ y: current.y, x: current.x + i });
          } else {
            lowPriority.push({ y: current.y, x: current.x + i });
          }
        }
      }
    }

    // --- Moving/marking time ---
    if (highPriority.length === 1) {
      // Continue here
      if (lowPriority.length === 0) {
        // Move without worries
      } else {
        // Junction, mark last and next
        nextMaze[last.y]![last.x]!.marks += 1;
        nextMaze[highPriority[0]!.y]![highPriority[0]!.x]!.marks += 1;
      }
    } else {
      if (highPriority.length > 2) {
        // Multiple good paths to choose from
      } else {
        // Nothing good. Turn back.
      }
    }
  };

  const updateEntrance = (x: number, y: number, index: number) => {
    if (maze === undefined) return;
    for (let i = -1; i < 2; i += 2) {
      if (maze[y + i]) {
        if (maze[y + i]![x]!.visited) {
          setEntrance({ x, y, index });
          setSearchHead((prev) => {
            return { ...prev, current: { x, y } };
          });
        }
      }
      if (maze[y]![x + i]) {
        if (maze[y]![x + i]!.visited) {
          setEntrance({ x, y, index });
          setSearchHead((prev) => {
            return { ...prev, current: { x, y } };
          });
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
      <div className="flex justify-center">
        <button onClick={findPossibleMoves} className="p-1 rounded bg-blue-400">
          Solve maze
        </button>
      </div>
      <div className="p-1" />
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
                solution={cell.solution}
                isEntrance={index === entrance?.index}
                isExit={index === exit?.index}
                updateExit={() => updateExit(cell.x, cell.y, index)}
                updateEntrance={() => updateEntrance(cell.x, cell.y, index)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
