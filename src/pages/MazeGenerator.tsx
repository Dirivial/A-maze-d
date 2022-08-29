import { useMemo, useState } from "react";
import useInterval from "../hooks/useInterval";
import { Cell } from "./cell";

export type GeneratedCell = {
  x: number;
  y: number;
  visited: boolean;
  wall: boolean;
};

export type MazeGeneratorProps = {
  width: number;
  height: number;
  sizeW: string;
  sizeH: string;
  setMaze: (maze: GeneratedCell[][]) => void;
};

export const MazeGenerator = ({
  width,
  height,
  sizeW,
  sizeH,
  setMaze,
}: MazeGeneratorProps) => {
  const [cells, setCells] = useState<GeneratedCell[][]>([]);
  const [wallStack, setWallStack] = useState<GeneratedCell[]>([]);
  const [generating, setGenerating] = useState(0);
  const [delay, setDelay] = useState(50);

  const pickStarting = (maze: GeneratedCell[][]) => {
    let randomX = Math.floor(Math.random() * (width - 2)) + 1;
    let randomY = Math.floor(Math.random() * (height - 2)) + 1;
    let walls: GeneratedCell[] = [];
    if (maze[randomY]![randomX]) {
      (maze[randomY]![randomX] as GeneratedCell).visited = true;
      (maze[randomY]![randomX] as GeneratedCell).wall = false;
      for (let i = -1; i < 2; i += 2) {
        if (maze[i + randomY]?.[randomX]) {
          maze[i + randomY]![randomX]!.wall = true;
          walls.push(maze[i + randomY]![randomX]!);
        }
        if (maze[randomY]?.[i + randomX]) {
          maze[randomY]![i + randomX]!.wall = true;
          walls.push(maze[randomY]![i + randomX]!);
        }
      }
    }

    setCells(maze);
    setWallStack(walls);
  };

  const generateCells = () => {
    if (!height || !width) return;
    let maze: GeneratedCell[][] = [];

    // Fill maze
    for (let i = 0; i < height; i++) {
      maze[i] = [];
      for (let j = 0; j < width; j++) {
        if (i > 0 && i < height - 1 && j > 0 && j < width - 1) {
          (maze[i] as GeneratedCell[]).push({
            x: j,
            y: i,
            visited: false,
            wall: false,
          });
        } else {
          (maze[i] as GeneratedCell[]).push({
            x: j,
            y: i,
            visited: false,
            wall: true,
          });
        }
      }
    }
    return maze as GeneratedCell[][];
  };

  const generateMaze = () => {
    let walls = [...wallStack];
    let maze = [...cells];
    let noChange = true;
    while (walls.length > 0 && noChange) {
      let someWall = walls.splice(
        Math.floor(Math.random() * wallStack.length),
        1
      )[0];

      if (someWall) {
        let x = someWall.x;
        let y = someWall.y;

        if (y > 0 && y < height - 1 && x > 0 && x < width - 1) {
          for (let i = -1; i < 2; i += 2) {
            if (
              (!maze.at(y - i)?.at(x)?.visited &&
                maze.at(y + i)?.at(x)?.visited) ||
              (!maze.at(y)?.at(x - i)?.visited &&
                maze.at(y)?.at(x + i)?.visited)
            ) {
              if (calcSurroundingCells(x, y, maze) < 2) {
                maze.at(y)!.at(x)!.visited = true;
                maze.at(y)!.at(x)!.wall = false;

                // Add surrounding cells as walls, if they should be added
                addWalls(maze, walls, x, y, height, width);
                noChange = false;
              }
            }
          }
        }
      }
    }

    if (wallStack.length === 0) {
      setGenerating(0);
      setMaze(maze);
    }

    setWallStack(walls);
    setCells(maze);
  };

  const addWalls = (
    maze: GeneratedCell[][],
    walls: GeneratedCell[],
    x: number,
    y: number,
    height: number,
    width: number
  ) => {
    for (let i = -1; i < 2; i += 2) {
      if (
        y > 0 &&
        y < height - 1 &&
        !maze.at(y + i)!.at(x)!.visited &&
        !maze.at(y + i)!.at(x)!.wall
      ) {
        maze.at(y + i)!.at(x)!.wall = true;
        walls.push(maze.at(y + i)!.at(x)!);
      }
      if (
        x > 0 &&
        x < width - 1 &&
        !maze.at(y)!.at(x + i)!.visited &&
        !maze.at(y)!.at(x + i)!.wall
      ) {
        maze.at(y)!.at(x + i)!.wall = true;
        walls.push(maze.at(y)!.at(x + i)!);
      }
    }
  };

  const calcSurroundingCells = (
    x: number,
    y: number,
    maze: GeneratedCell[][]
  ) => {
    let sumOfSurrounding: number = 0;

    for (let i = -1; i < 2; i += 2) {
      if (maze.at(y + i)?.at(x)?.visited) {
        sumOfSurrounding++;
      }
      if (maze.at(y)?.at(x + i)?.visited) {
        sumOfSurrounding++;
      }
    }
    return sumOfSurrounding as number;
  };

  useMemo(() => {
    generateCells();
  }, [width, height]);

  useInterval(
    () => {
      generateMaze();
    },
    generating === 2 ? delay : null
  );

  const handleClickGeneration = () => {
    if (generating === 2) {
      setGenerating(1);
    } else {
      if (generating === 1) {
        setGenerating(2);
      } else {
        pickStarting(generateCells()!);
        setGenerating(2);
      }
    }
  };

  return (
    <div>
      <div>
        {" "}
        <button
          onClick={handleClickGeneration}
          className={
            "p-1 rounded" + (generating === 2 ? " bg-blue-600" : " bg-blue-400")
          }
        >
          Generate new maze
        </button>
        <label className="">Delay</label>
        <input
          className="bg-blue-400 rounded pl-1 w-14"
          type="number"
          id="delay"
          defaultValue={delay}
          min="0"
          max="1000"
          onChange={(e) => setDelay(e.target.valueAsNumber)}
        />
      </div>
      <div className="border rounded border-blue-300">
        <div
          style={{ width: sizeW, height: sizeH }}
          className="bg-gray-600 rounded"
        >
          {cells?.flat().map((cell, index) => {
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