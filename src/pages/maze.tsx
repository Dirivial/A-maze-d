import { useState, useEffect } from "react";

import Cell from "./cell";
import type { CellProps } from "./cell";

type MazeProps = {
  width: number;
  height: number;
};

type GeneratedCell = {
  x: number;
  y: number;
  visited: boolean;
  wall: boolean;
};

type MazeStack = {
  x: number;
  y: number;
};

const Maze = ({ width, height }: MazeProps) => {
  const [cells, setCells] = useState<CellProps[]>([]);

  const generateCells = (event: React.MouseEvent<HTMLButtonElement>) => {
    let maze: GeneratedCell[][] = [];

    // Fill maze
    for (let i = 0; i < width; i++) {
      maze[i] = [];
      for (let j = 0; j < height; j++) {
        (maze[i] as GeneratedCell[]).push({
          x: i,
          y: j,
          visited: false,
          wall: true,
        });
      }
    }

    // Choose a starting point -- as of now on the first row but should be random
    let randomX = 2; //Math.floor(Math.random() * width);
    let randomY = 1;
    let wallStack: MazeStack[] = [];
    if (maze[randomX]![randomY]) {
      (maze[randomX]![randomY] as GeneratedCell).visited = true;
      (maze[randomX]![randomY] as GeneratedCell).wall = false;
      for (let i = -1; i < 2; i += 2) {
        if (maze[i + randomX]?.[randomY]) {
          wallStack.push(maze[i + randomX]![randomY]!);
        }
        if (maze[randomX]?.[i + randomY]) {
          wallStack.push(maze[randomX]![i + randomY]!);
        }
      }
    }

    wallStack.map((value) => console.log(value));

    // Main loop for generating maze
    while (wallStack.length > 0) {
      let current = wallStack.pop() as GeneratedCell;
    }
  };

  return (
    <div className="rounded border flex flex-col">
      <button onClick={generateCells}>Generate new maze</button>
      <div className="grid grid-cols-10">
        {Object.values(cells).map((cell, index) => {
          return (
            <Cell
              key={index}
              x={cell.x}
              y={cell.y}
              isSelected={cell.isSelected}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Maze;
