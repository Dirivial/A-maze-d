import { useState } from "react";

type CellProps = {
  x: number;
  y: number;
  visited: boolean;
  wall: boolean;
};

const Cell = ({ x, y, visited, wall }: CellProps) => {
  const [selected, setSelected] = useState(visited);
  const clickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const button: HTMLButtonElement = event.currentTarget;
    setSelected((prev) => !prev);
  };

  return (
    <button
      onClick={clickHandler}
      className={
        "rounded border w-7 h-7 m-0" +
        (wall ? " bg-gray-400" : visited ? " bg-orange-500" : " bg-white")
      }
    >
      {wall ? "w" : visited ? "c" : "u"}
    </button>
  );
};

export default Cell;
export type { CellProps };
