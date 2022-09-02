import { SolutionCell, Coordinate } from "../lib/types";

export type DepthFirstSearchProps = {
  maze: SolutionCell[][];
  searchHead: {current: Coordinate, last: Coordinate};
}

export default function DepthFirstSearch({maze, searchHead}: DepthFirstSearchProps): DepthFirstSearchProps {
    const nextMaze = [...maze];

    // Look at the positions up,down,left,right and store them if they are possible paths.
    const current = searchHead.current;
    const last = searchHead.last;
    const highPriority: Coordinate[] = []; // Cells with no marks
    const lowPriority: Coordinate[] = []; // Cells with one mark

    for (let i = -1; i < 2; i += 2) {
      // Cell above/below, avoiding last cell
      if (current.y + i !== last.y && maze[current.y + i]) {
        const cell = maze[current.y + i]![current.x];
        if (cell!.visited && cell!.marks < 2) {
          if (cell!.marks === 0) {
            highPriority.push({ y: current.y + i, x: current.x });
          } else {
            lowPriority.push({ y: current.y + i, x: current.x });
          }
        }
      }
      // Cell to the left/right, avoiding last cell
      if (current.x + i !== last.x && maze[current.y]![current.x + i]) {
        const cell = maze[current.y]![current.x + i];
        if (cell!.visited && cell!.marks < 2) {
          if (cell!.marks === 0) {
            highPriority.push({ y: current.y, x: current.x + i });
          } else {
            lowPriority.push({ y: current.y, x: current.x + i });
          }
        }
      }
    }

    // This prevents junctions from getting blocked
    if (
      lowPriority.length + highPriority.length > 1 &&
      nextMaze[current.y]![current.x]!.marks === 1
    ) {
      nextMaze[current.y]![current.x]!.marks--;
    }

    // Add mark to the last cell
    nextMaze[last.y]![last.x]!.marks += 1;

    // --- Moving/marking ---
    if (lowPriority.length === 0) {
      if (highPriority.length > 0) {
        // Choose a random high-priority path.
        const randomIndex = Math.floor(Math.random() * highPriority.length);
        return {maze: nextMaze, searchHead: {current: highPriority[randomIndex]!, last: current}};
      }

      // Go back. No paths found.
      nextMaze[current.y]![current.x]!.marks += 1;
      return {maze: nextMaze, searchHead: {current: last, last: current}};
    }

    if (highPriority.length > 0) {
      // Choose random high-priority
      nextMaze[last.y]![last.x]!.marks += 1;
      const randomIndex = Math.floor(Math.random() * highPriority.length);
      return {maze: nextMaze, searchHead: {current: highPriority[randomIndex]!, last: current}};
    }

    // Choose random low-priority
    const randomIndex = Math.floor(Math.random() * lowPriority.length);
    return {maze: nextMaze, searchHead: {current: lowPriority[randomIndex]!, last: current}};
}