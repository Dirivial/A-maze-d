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
    setColor((prev) => {
      if (isEntrance) {
        return " bg-red-700";
      }
      if (isExit) {
        return " bg-red-700";
      }
      if (path) {
        return marks === 0
          ? " bg-purple-400"
          : marks === 1
          ? " bg-purple-600"
          : " bg-purple-900";
      }
      return " bg-gray-600";
    });
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
      className={
        "rounded-lg w-7 h-7 m-0 transition-color duration-300 " + color
      }
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
            style={{ maxWidth: "1.7rem", maxHeight: "1.7rem" }}
            icon={isEntrance ? faCircleDot : isExit ? faFlag : faDotCircle}
          />
        ) : (
          "‎"
        )}
      </div>
    </button>
  );
};
