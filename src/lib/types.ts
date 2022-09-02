type Coordinate = {
  x: number;
  y: number;
};

type GeneratedCell = {
  x: number;
  y: number;
  visited: boolean;
  wall: boolean;
};

type SolutionCell = GeneratedCell & {
  solution: boolean;
  marks: number;
};

export {type Coordinate, type GeneratedCell, type SolutionCell}

