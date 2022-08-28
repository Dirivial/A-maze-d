import { useState } from "react";

type CellProps = {
  x: number;
  y: number;
  visited: boolean;
  updateExit: () => void;
  updateEntrance: () => void;
};

export const Cell = ({
  x,
  y,
  visited,
  updateExit,
  updateEntrance,
}: CellProps) => {
  const clickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (event.shiftKey) {
      console.log("Setting goal to cell @ ", x, y);
    } else {
      console.log("Setting start to cell @ ", x, y);
    }

    console.log("Cell @ ", x, y);
  };

  return (
    <button
      onClick={clickHandler}
      className={
        "rounded-lg w-7 h-7 m-0 inline-block box-border" +
        (visited ? " bg-purple-400" : " bg-gray-600")
      }
      style={{ minWidth: "1.75rem" }}
    >
      {"‎"}
    </button>
  );
};
