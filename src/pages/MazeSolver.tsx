import { useEffect, useMemo, useState } from "react";
import useInterval from "../hooks/useInterval";
import DepthFirstSearch from "./DepthFirstSearch";
import { SolutionCell as Cell } from "./SolutionCell";
import { GeneratedCell, Coordinate, SolutionCell } from "./types";

export type MazeSolverProps = {
  width: number;
  generatedMaze: () => GeneratedCell[][];
};

type SpecialCell = Coordinate & {
  index: number;
};

export const MazeSolver = ({ width, generatedMaze }: MazeSolverProps) => {
  const [maze, setMaze] = useState<SolutionCell[][]>([]);
  const [entrance, setEntrance] = useState<SpecialCell>();
  const [exit, setExit] = useState<SpecialCell>();
  const [paused, setPaused] = useState(true);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [searchHead, setSearchHead] = useState({
    current: { x: -1, y: -1 },
    last: { x: 0, y: 0 },
  });

  // Check if maze is solved
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

  // Import maze when needed
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
      solveNextStep();
    },
    done || paused ? null : 50
  );

  // Calculate and show the next move made by the algorithm the user chose
  function solveNextStep() {
    if (searchHead.current.x === -1 || searchHead.current.y === -1) return;
    const result = DepthFirstSearch({ maze, searchHead });
    setMaze(result.maze);
    setSearchHead(result.searchHead);
  }

  function resetMaze() {
    setPaused(true);
    setDone(false);
    setMaze((prev) => {
      const newMaze = [...prev];
      newMaze.flat().forEach((cell) => (cell.marks = 0));
      return newMaze;
    });
    setSearchHead({ current: { x: -1, y: -1 }, last: { x: 0, y: 0 } });
    setEntrance(undefined);
    setExit(undefined);
    setErrorMsg("");
  }

  function pauseOrStart() {
    if (done) {
      setErrorMsg("Reset before starting again.");
      return;
    }
    if (paused) {
      if (!entrance || !exit) {
        setErrorMsg(
          "You need to set start and goal.\n(Click square for start, Shift+Click for goal)"
        );
        return;
      }
      setPaused(false);
      setErrorMsg("");
      return;
    }
    setPaused(true);
    setErrorMsg("");
  }

  function updateEntrance(x: number, y: number, index: number) {
    if (maze === undefined) return;

    if (maze[y]![x]!.visited) {
      setEntrance({ x, y, index });
      setSearchHead((prev) => {
        return { ...prev, current: { x, y } };
      });
    }
  }

  function updateExit(x: number, y: number, index: number) {
    if (maze === undefined) return;
    if (maze[y]![x]!.visited) {
      setExit({ x, y, index });
    }
  }

  return (
    <div>
      <div className="flex justify-center align-middle">
        <button
          onClick={() => pauseOrStart()}
          className="p-2 rounded bg-transparent transition-colors hover:bg-slate-600 text-gray-100"
        >
          {paused ? "Start" : "Pause"}
        </button>
        <button
          onClick={() => resetMaze()}
          className="p-2 rounded bg-transparent transition-colors hover:bg-slate-600 text-gray-100"
        >
          Reset
        </button>
      </div>
      <div className="p-3" />
      <div className="flex justify-center">
        <div
          style={{
            maxWidth: width * 1.75 + "rem",
            minWidth: width * 1.75 + "rem",
          }}
          className="bg-gray-600 rounded flex flex-wrap"
        >
          {maze?.flat().map((cell, index) => {
            return (
              <Cell
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
      {errorMsg.length > 0 ? (
        <div id="errorText" className="p-3 text-orange-300 flex justify-center">
          {errorMsg}
        </div>
      ) : null}
    </div>
  );
};
