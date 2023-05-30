import { sampleInput } from "./input";

const exampleInput = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`;

const smallExample = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;

class MatrixSettings {
  xSize: number;
  ySize: number;
  xOffset: number;
  yOffset: number;
}

const smallExampleMatrixSettings: MatrixSettings = {
  xSize: 6,
  ySize: 6,
  xOffset: 0,
  yOffset: 0,
};

const exampleMatrixSettings: MatrixSettings = {
  xSize: 26,
  ySize: 21,
  xOffset: 11,
  yOffset: 5,
};

// part 2 notes.
// So for this one, I think I need to create a knot class.
// the class should contain:
// a Coordinate type property to keep track of its location
// a "lead" property that contains the Knot that is in front of it
// a "trail" property that contains the Knot that is behind it.

// then, as we go through each motion, when going to move the "tail" or the "trail" knot

// if there is a "trail" knot
// we need to call doMotionStep on it, passing in the direction it needs to move and the trail knot it self as the head

// if there is not a "trail" knot, then do nothing

enum Direction {
  Up = "Up",
  Down = "Down",
  Left = "Left",
  Right = "Right",
}

const MotionStrToDirectionMap = {
  U: Direction.Up,
  D: Direction.Down,
  L: Direction.Left,
  R: Direction.Right,
};

class Motion {
  direction: Direction;
  steps: number;
  constructor(dir: Direction, s: number) {
    this.direction = dir;
    this.steps = s;
  }
}

type Coordinate = { x: number; y: number };

class Knot {
  id: number;
  position: Coordinate;
  lead: Knot = null;
  trail: Knot = null;
  positionsVisited: Coordinate[] = [];
  constructor(knotId: number, initialPosition: Coordinate, leadKnot: Knot) {
    this.id = knotId;
    this.position = { ...initialPosition };
    this.lead = leadKnot;
    this.positionsVisited.push({ ...initialPosition });
  }
}

console.log("Answer: ", getPositionsTailVisitedAtLeastOnce(sampleInput));
//Answer: 2533

// MAIN //
function getPositionsTailVisitedAtLeastOnce(
  motionsStr: string,
  matrixSettings: MatrixSettings = null
) {
  const headKnot = createHeadKnotWith9KnotsAttached();
  const motions: Motion[] = parseMotionsStrIntoMotions(motionsStr);

  for (const m of motions) {
    console.log("Motion starting. ", m.direction, m.steps);
    for (let s = 1; s <= m.steps; s++) {
      doMotionStep(headKnot, m.direction);
      //   if (matrixSettings) {
      //     showStateOfBoard(headKnot, matrixSettings);
      //   }
    }
    if (matrixSettings) {
      showStateOfBoard(headKnot, matrixSettings);
    }
  }
  const tailKnot = getTailKnotFromHeadKnot(headKnot);
  return tailKnot.positionsVisited.length;
}

function doMotionStep(knot: Knot, direction: Direction) {
  moveKnotOneStep(knot, direction);
  addPositionVisitedIfUnique(knot.position, knot.positionsVisited);

  // move the trail knot if there is one.
  if (knot.trail) {
    catchUpKnotIfTrailingTooMuch(knot.trail);
  }
}

function getTailKnotFromHeadKnot(headKnot: Knot) {
  let tailKnot: Knot = null;
  function findTailKnot(currentKnot: Knot) {
    if (currentKnot.trail === null) {
      tailKnot = currentKnot;
    } else {
      findTailKnot(currentKnot.trail);
    }
  }
  findTailKnot(headKnot);
  return tailKnot;
}
// END MAIN //

// SETUP & STRING INTERPOLATION //
function createHeadKnotWith9KnotsAttached() {
  const startingPosition: Coordinate = { x: 0, y: 0 };
  const head = new Knot(0, startingPosition, null);
  let lastKnotMade: Knot = head;
  for (let i = 1; i <= 9; i++) {
    const newKnot: Knot = new Knot(i, { ...startingPosition }, lastKnotMade);
    lastKnotMade.trail = newKnot;
    lastKnotMade = newKnot;
  }
  return head;
}

function parseMotionsStrIntoMotions(motionsStr: string): Motion[] {
  const motions: Motion[] = [];
  const motionStrByLine = motionsStr.split("\n"); // ["R 4", "U 4", ...]

  for (let i = 0; i < motionStrByLine.length; i++) {
    const currentMotionStr = motionStrByLine[i];
    const directionStepsSplit = currentMotionStr.split(" ");
    const directionStr = directionStepsSplit[0];
    const direction: Direction = MotionStrToDirectionMap[directionStr];
    const steps: number = parseInt(directionStepsSplit[1]);
    motions.push(new Motion(direction, steps));
  }

  return motions;
}

// END SETUP & STRING INTERPOLATION //

// MOVE KNOT FUNCTIONS //

function catchUpKnotIfTrailingTooMuch(knot: Knot) {
  // Check if the lead knot is too far away from knot passed in.
  if (!isKnotLeadingTooFarFromTrail(knot.lead)) {
    // The knot is NOT trailing too much, so do not move it.
    return;
  }
  // The knot is too far away.
  // Figure out which direction to move the knot so it can catchUp.
  const onSameCol = isOnSameCol(knot.position, knot.lead.position);
  const onSameRow = isOnSameRow(knot.position, knot.lead.position);
  let directionToMove: Direction = null;

  // If the lead knot and the knot are on the same column still
  if (onSameCol) {
    // The lead knot moved up or down too far. Determine which direction it is.
    if (knot.lead.position.y > knot.position.y) {
      directionToMove = Direction.Up;
    } else {
      directionToMove = Direction.Down;
    }
    moveKnotOneStep(knot, directionToMove);
    addPositionVisitedIfUnique(knot.position, knot.positionsVisited);
    if (knot.trail) {
      catchUpKnotIfTrailingTooMuch(knot.trail);
    }
    return;
  }
  // If the lead knot and knot are on the same row still
  if (onSameRow) {
    // The lead knot moved left or right too far. Determine which direction it is.
    if (knot.lead.position.x > knot.position.x) {
      directionToMove = Direction.Right;
    } else {
      directionToMove = Direction.Left;
    }
    moveKnotOneStep(knot, directionToMove);
    addPositionVisitedIfUnique(knot.position, knot.positionsVisited);
    if (knot.trail) {
      catchUpKnotIfTrailingTooMuch(knot.trail);
    }
    return;
  }

  // lead knot is not on the same row or column
  // need to catch up to the lead not by moving diagonally
  catchUpKnotByMovingDiagonally(knot);

  // handle catching up the next knot recursively
  if (knot.trail) {
    catchUpKnotIfTrailingTooMuch(knot.trail);
  }
}

function catchUpKnotByMovingDiagonally(knot: Knot) {
  let xMoveDirection: Direction = null;
  let yMoveDirection: Direction = null;
  if (knot.lead.position.x > knot.position.x) {
    xMoveDirection = Direction.Right;
  } else {
    xMoveDirection = Direction.Left;
  }
  if (knot.lead.position.y > knot.position.y) {
    yMoveDirection = Direction.Up;
  } else {
    yMoveDirection = Direction.Down;
  }
  moveKnotOneStep(knot, xMoveDirection);
  moveKnotOneStep(knot, yMoveDirection);
  addPositionVisitedIfUnique(knot.position, knot.positionsVisited);
}

function moveKnotOneStep(knot: Knot, direction: Direction) {
  switch (direction) {
    case Direction.Up:
      knot.position.y = knot.position.y + 1;
      break;
    case Direction.Down:
      knot.position.y = knot.position.y - 1;
      break;
    case Direction.Left:
      knot.position.x = knot.position.x - 1;
      break;
    case Direction.Right:
      knot.position.x = knot.position.x + 1;
      break;
  }
}

function addPositionVisitedIfUnique(
  newPostion: Coordinate,
  positionsVisited: Coordinate[]
) {
  let isUniqueVisit = true;
  for (const position of positionsVisited) {
    if (isOnSamePosition(position, newPostion)) {
      isUniqueVisit = false;
      break;
    }
  }
  if (isUniqueVisit) {
    positionsVisited.push({ ...newPostion });
  }
}

// END MOVE KNOT FUNCTIONS //

// COMPARE KNOT FUNCTIONS //

function isOnSameRow(coord1: Coordinate, coord2: Coordinate): boolean {
  return coord1.y === coord2.y;
}
function isOnSameCol(coord1: Coordinate, coord2: Coordinate): boolean {
  return coord1.x === coord2.x;
}
function isOnSamePosition(coord1: Coordinate, coord: Coordinate): boolean {
  return isOnSameRow(coord1, coord) && isOnSameCol(coord1, coord);
}

function isKnotLeadingTooFarFromTrail(knot: Knot): boolean {
  if (!knot.trail) {
    return false;
  }
  const xAxisDistance = knot.position.x - knot.trail.position.x;
  if (xAxisDistance > 1 || xAxisDistance < -1) {
    // console.log(`[X-Axis] Knot is too far from its trail. Knot ${knot.id}: ${knot.position}, Trail ${knot.trail.id}: ${knot.trail.position}`);
    return true;
  }
  const yAxisDistance = knot.position.y - knot.trail.position.y;
  if (yAxisDistance > 1 || yAxisDistance < -1) {
    // console.log(`[Y-Axis] Knot is too far from its trail. Knot ${knot.id}: ${knot.position}, Trail ${knot.trail.id}: ${knot.trail.position})`;
    return true;
  }
}
// END COMPARE KNOT FUNCTIONS //

// DEBUGGING //

function showStateOfBoard(headKnot: Knot, settings: MatrixSettings) {
  const dotMatrix = generateMatrixOfDots(settings.xSize, settings.ySize);

  let currentKnot = getTailKnotFromHeadKnot(headKnot);
  while (currentKnot) {
    const xPosition = currentKnot.position.x + settings.xOffset;
    const yPosition = currentKnot.position.y + settings.yOffset;
    const arrOfDots: string[] = dotMatrix[yPosition][0].split("");
    arrOfDots[xPosition] = currentKnot.id.toString();
    dotMatrix[yPosition][0] = arrOfDots.join("");
    currentKnot = currentKnot.lead;
  }

  console.log(dotMatrix.reverse());
}

function generateMatrixOfDots(x: number, y: number) {
  const matrix = [];
  for (let i = 0; i < y; i++) {
    let newColumns = "";
    for (let j = 0; j < x; j++) {
      const newCol = ".";
      newColumns += newCol;
    }
    const newRow = [newColumns];
    matrix.push(newRow);
  }
  return matrix;
}

// END DEBUGGING //
