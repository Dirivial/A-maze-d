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

export default Cell;
export type { CellProps };
