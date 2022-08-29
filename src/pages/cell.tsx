import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag, faCircleDot } from "@fortawesome/free-regular-svg-icons";
import { useMemo, useState } from "react";

export type CellProps = {
  path: boolean;
  solution: boolean;
  isExit: boolean;
  isEntrance: boolean;
  updateExit: () => void;
  updateEntrance: () => void;
};

export const Cell = ({
  path,
  solution,
  isExit,
  isEntrance,
  updateExit,
  updateEntrance,
}: CellProps) => {
  const [color, setColor] = useState(
    solution ? " bg-red-500" : path ? " bg-purple-400" : " bg-gray-600"
  );

  useMemo(() => {
    setColor(
      isEntrance
        ? " bg-red-700"
        : isExit
        ? " bg-red-700"
        : solution
        ? " bg-red-500"
        : path
        ? " bg-purple-400"
        : " bg-gray-600"
    );
  }, [path, solution, isExit, isEntrance]);

  const clickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (isExit || isEntrance) return;

    if (event.shiftKey) {
      updateExit();
    } else {
      updateEntrance();
    }
  };

  return (
    <button
      onClick={clickHandler}
      className={"rounded-lg w-7 h-7 m-0 inline-block box-border " + color}
      style={{ minWidth: "1.75rem", maxWidth: "1.75rem" }}
    >
      {isExit || isEntrance ? (
        <FontAwesomeIcon icon={isEntrance ? faCircleDot : faFlag} />
      ) : (
        "‎"
      )}
    </button>
  );
};
