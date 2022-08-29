import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag, faTrashCan } from "@fortawesome/free-regular-svg-icons";

export type CellProps = {
  x: number;
  y: number;
  path: boolean;
  solution: boolean;
  isExit: boolean;
  isEntrance: boolean;
  updateExit: () => void;
  updateEntrance: () => void;
};

export const Cell = ({
  x,
  y,
  path,
  solution,
  isExit,
  isEntrance,
  updateExit,
  updateEntrance,
}: CellProps) => {
  const clickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (isExit || isEntrance) return;

    if (event.shiftKey) {
      console.log("Setting goal to cell @ ", x, y);
      updateExit();
    } else {
      console.log("Setting start to cell @ ", x, y);
      updateEntrance();
    }
  };

  const calcColor = () => {
    return (
      solution ? " bg-red-500" : path ? " bg-purple-400" : " bg-gray-600"
    ) as string;
  };

  return (
    <button
      onClick={clickHandler}
      className={"rounded-lg w-7 h-7 m-0 inline-block box-border " + calcColor}
      style={{ minWidth: "1.75rem", maxWidth: "1.75rem" }}
    >
      {isExit ? <FontAwesomeIcon icon={faFlag} /> : "‎"}
    </button>
  );
};
