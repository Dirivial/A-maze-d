import { useEffect, useMemo, useState } from "react";
import useInterval from "../hooks/useInterval";
import { SolutionCell } from "./SolutionCell";
import { GeneratedCell } from "./MazeGenerator";

export type MazeSolverProps = {
  width: number;
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

export const MazeSolver = ({ width, generatedMaze }: MazeSolverProps) => {
  const [maze, setMaze] = useState<SolutionCell[][]>([]);
  const [entrance, setEntrance] = useState<SpecialCell>();
  const [exit, setExit] = useState<SpecialCell>();
  const [done, setDone] = useState(true);

  const [searchHead, setSearchHead] = useState({
    current: { x: -1, y: -1 },
    last: { x: 0, y: 0 },
  });

  useEffect(() => {
    if (
      exit &&
      searchHead.current.x === exit.x &&
      searchHead.current.y === exit.y
    ) {
      if (maze[searchHead.last.y]![searchHead.last.x]!.marks === 0) {
        maze[searchHead.last.y]![searchHead.last.x]!.marks++;
      }
      setDone(true);
    }
  }, [searchHead]);

  useMemo(() => {
    let newMaze: SolutionCell[][] = [];
    let oldMaze: GeneratedCell[][] = generatedMaze();
    oldMaze.forEach((column, index) => {
      newMaze.push([]);
      column.forEach((item) =>
        newMaze[index]?.push({
          ...item,
          solution: false,
          marks: item.wall ? 2 : 0,
        })
      );
    });
    setMaze(newMaze);
  }, [generatedMaze]);

  // Wait until algorithm is implemented
  useInterval(
    () => {
      findPossibleMoves();
    },
    done ? null : 50
  );

  const findPossibleMoves = () => {
    if (searchHead.current.x === -1 || searchHead.current.y === -1) return;
    let nextMaze = [...maze];

    // Look at the positions up,down,left,right and store them if they are possible paths.
    let current = searchHead.current;
    let last = searchHead.last;
    let highPriority: Coordinate[] = []; // Cells with no marks
    let lowPriority: Coordinate[] = []; // Cells with one mark

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

    if (
      lowPriority.length + highPriority.length > 1 &&
      nextMaze[current.y]![current.x]!.marks === 1
    ) {
      nextMaze[current.y]![current.x]!.marks--;
    }

    nextMaze[last.y]![last.x]!.marks += 1;

    // --- Moving/marking ---
    if (lowPriority.length === 0) {
      if (highPriority.length > 0) {
        // Choose a random high-priority path.
        let randomIndex = Math.floor(Math.random() * highPriority.length);
        setSearchHead((prev) => {
          return {
            current: {
              x: highPriority[randomIndex]!.x,
              y: highPriority[randomIndex]!.y,
            },
            last: { x: prev.current.x, y: prev.current.y },
          };
        });
      } else {
        // Go back. No paths found.
        nextMaze[current.y]![current.x]!.marks += 1;
        setSearchHead((prev) => {
          return {
            current: { x: prev.last.x, y: prev.last.y },
            last: { x: prev.current.x, y: prev.current.y },
          };
        });
      }
    } else {
      if (highPriority.length > 0) {
        // Choose random high-priority
        nextMaze[last.y]![last.x]!.marks += 1;
        let randomIndex = Math.floor(Math.random() * highPriority.length);
        setSearchHead((prev) => {
          return {
            current: {
              x: highPriority[randomIndex]!.x,
              y: highPriority[randomIndex]!.y,
            },
            last: { x: prev.current.x, y: prev.current.y },
          };
        });
      } else {
        // Choose random low-priority
        let randomIndex = Math.floor(Math.random() * lowPriority.length);

        setSearchHead((prev) => {
          return {
            current: {
              x: lowPriority[randomIndex]!.x,
              y: lowPriority[randomIndex]!.y,
            },
            last: { x: prev.current.x, y: prev.current.y },
          };
        });
      }
    }
    setMaze([...nextMaze]);
    return;
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
      <div className="flex justify-center align-middle">
        <button
          onClick={() => setDone((prev) => !prev)}
          className="p-2 rounded bg-transparent transition-colors hover:bg-slate-600 text-gray-100"
        >
          {done ? "Start" : "Pause"}
        </button>
      </div>
      <div className="p-3" />
      <div className="">
        <div
          style={{
            maxWidth: width * 1.75 + "rem",
            minWidth: width * 1.75 + "rem",
          }}
          className="bg-gray-600 rounded flex flex-wrap"
        >
          {maze?.flat().map((cell, index) => {
            return (
              <SolutionCell
                key={index}
                path={cell.visited}
                current={
                  searchHead.current.y * width + searchHead.current.x === index
                }
                marks={cell.marks}
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
