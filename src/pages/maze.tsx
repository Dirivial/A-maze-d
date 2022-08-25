import { useState } from "react";

type CellProps = {
  x: number;
  y: number;
  isSelected: boolean;
};

const Cell = ({ x, y, isSelected }: CellProps) => {
  const [selected, setSelected] = useState(isSelected);
  const clickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const button: HTMLButtonElement = event.currentTarget;
    setSelected((prev) => !prev);
  };

  return (
    <button
      onClick={clickHandler}
      className={"rounded border w-7 h-7 m-0" + (selected ? " bg-red-500" : "")}
    >
      {" "}
    </button>
  );
};

type MazeProps = {
  width: number;
  height: number;
};

const Maze = ({ width, height }: MazeProps) => {
  const [cells, setCells] = useState([{ x: 0, y: 0, isSelected: false }]);

  const generateCells = (event: React.MouseEvent<HTMLButtonElement>) => {
    let newCells: CellProps[] = [];

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        newCells.push({
          x: j,
          y: i,
          isSelected: Math.floor(Math.random() * 2) === 0,
        });
      }
    }

    setCells(newCells);
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
