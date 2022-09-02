import { useMemo, useState } from "react";
import useInterval from "../hooks/useInterval";
import Cell from "./Cell";
import { GeneratedCell } from "../lib/types";

export type MazeGeneratorProps = {
  oldDimensions: { width: number; height: number };
  setMazeDimensions: (width: number, height: number) => void;
  setMaze: (maze: GeneratedCell[][]) => void;
};

export default function MazeGenerator({
  oldDimensions,
  setMazeDimensions,
  setMaze,
}: MazeGeneratorProps) {
  const [width, setWidth] = useState(
    oldDimensions.width ? oldDimensions.width : 15
  );
  const [height, setHeight] = useState(
    oldDimensions.height ? oldDimensions.height : 15
  );
  const [cells, setCells] = useState<GeneratedCell[][]>([]);
  const [wallStack, setWallStack] = useState<GeneratedCell[]>([]);
  const [generating, setGenerating] = useState(0);

  useMemo(() => {
    if (width > 5 && height > 5 && height < 31 && width < 31) {
      const newMaze = generateCells();
      setCells(newMaze);
    } else {
      setCells([]);
    }
  }, [width, height]);

  useInterval(
    () => {
      generateMaze();
    },
    generating === 2 ? 0 : null
  );

  function pickStarting(maze: GeneratedCell[][]) {
    const randomX = Math.floor(Math.random() * (width - 2)) + 1;
    const randomY = Math.floor(Math.random() * (height - 2)) + 1;
    const walls: GeneratedCell[] = [];
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
  }

  function generateCells(): GeneratedCell[][] {
    if (!height || !width) return [];
    const maze: GeneratedCell[][] = [];

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
  }

  function generateMaze() {
    const walls = [...wallStack];
    const maze = [...cells];
    let noChange = true;
    while (walls.length > 0 && noChange) {
      const someWall = walls.splice(
        Math.floor(Math.random() * wallStack.length),
        1
      )[0];

      if (someWall) {
        const x = someWall.x;
        const y = someWall.y;

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
      setMazeDimensions(width, height);
      setMaze([...maze]);
    }

    setWallStack(walls);
    setCells(maze);
  }

  function addWalls(
    maze: GeneratedCell[][],
    walls: GeneratedCell[],
    x: number,
    y: number,
    height: number,
    width: number
  ) {
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
  }

  function calcSurroundingCells(x: number, y: number, maze: GeneratedCell[][]) {
    let sumOfSurrounding = 0;

    for (let i = -1; i < 2; i += 2) {
      if (maze.at(y + i)?.at(x)?.visited) {
        sumOfSurrounding++;
      }
      if (maze.at(y)?.at(x + i)?.visited) {
        sumOfSurrounding++;
      }
    }
    return sumOfSurrounding as number;
  }

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
      <div className="flex justify-center items-center gap-x-1 text-gray-100">
        <div className="flex gap-4 bg-transparent p-2">
          <label>Width:</label>
          <input
            className="bg-slate-600 rounded pl-1 w-10"
            type="number"
            id="maze-width"
            defaultValue={oldDimensions.width ? oldDimensions.width : 15}
            min="5"
            max="30"
            onChange={(e) => setWidth(e.target.valueAsNumber)}
          />
          <label>Height:</label>
          <input
            className="bg-slate-600 rounded pl-1 w-10"
            type="number"
            id="maze-height"
            defaultValue={oldDimensions.height ? oldDimensions.height : 15}
            min="5"
            max="30"
            onChange={(e) => setHeight(e.target.valueAsNumber)}
          />
        </div>
        <button
          onClick={handleClickGeneration}
          className={
            "p-1 rounded transition-colors" +
            (generating === 2
              ? " bg-slate-600"
              : " bg-transparent hover:bg-slate-600")
          }
        >
          Generate
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
          {cells?.flat().map((cell, index) => {
            return <Cell key={index} path={cell.visited} />;
          })}
        </div>
      </div>
    </div>
  );
}
