import { useMemo, useState } from "react";

export type CellProps = {
  path: boolean;
};

export default function Cell({ path }: CellProps) {
  const [color, setColor] = useState(path ? " bg-purple-400" : " bg-gray-600");

  useMemo(() => {
    setColor(path ? " bg-purple-400" : " bg-gray-600");
  }, [path]);

  return (
    <button
      className={
        "rounded-lg w-7 h-7 m-0 inline-block box-border transition-color duration-200 " +
        color
      }
      style={{ minWidth: "1.75rem", maxWidth: "1.75rem" }}
    >
      {"‎"}
    </button>
  );
}
