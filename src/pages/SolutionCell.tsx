import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlag,
  faCircleDot,
  faDotCircle,
} from "@fortawesome/free-regular-svg-icons";
import { useMemo, useState } from "react";

export type SolutionCellProps = {
  path: boolean;
  current: boolean;
  marks: number;
  isExit: boolean;
  isEntrance: boolean;
  updateExit: () => void;
  updateEntrance: () => void;
};

export const SolutionCell = ({
  path,
  current,
  marks,
  isExit,
  isEntrance,
  updateExit,
  updateEntrance,
}: SolutionCellProps) => {
  const [color, setColor] = useState(
    current ? " bg-red-500" : path ? " bg-purple-400" : " bg-gray-600"
  );

  useMemo(() => {
    setColor(
      isEntrance
        ? " bg-red-700"
        : isExit
        ? " bg-red-700"
        : marks < 1
        ? " bg-red-500"
        : marks < 2
        ? " bg-red-400"
        : path
        ? " bg-purple-600"
        : " bg-gray-600"
    );
  }, [path, marks, current, isExit, isEntrance]);

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
      style={{
        minWidth: "1.75rem",
        maxWidth: "1.75rem",
        minHeight: "1.75rem",
        maxHeight: "1.75rem",
      }}
    >
      <div className="flex justify-center align-middle">
        {isExit || isEntrance || current ? (
          <FontAwesomeIcon
            style={{ width: "0.8rem", height: "0.8rem" }}
            icon={isEntrance ? faCircleDot : isExit ? faFlag : faDotCircle}
          />
        ) : (
          "‎"
        )}
      </div>
    </button>
  );
};
