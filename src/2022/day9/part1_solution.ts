import { Dir } from "fs";
import { sampleInput } from "./input";

const exampleInput = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;

const smallExample = `R 4
U 4`;

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
type Coordinate = [number, number];

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

function getPositionsTailVisitedAtLeastOnce(motionsStr: string) {
  const startingPosition: Coordinate = [0, 0];
  let currentHeadPosition: Coordinate = [...startingPosition];
  let currentTailPosition: Coordinate = [...startingPosition];

  const coordinatesTailVisited: Coordinate[] = [[...currentTailPosition]];
  const motions: Motion[] = parseMotionsStrIntoMotions(motionsStr);

  for (const m of motions) {
    for (let s = 1; s <= m.steps; s++) {
      const oldTailPosition: Coordinate = [...currentTailPosition];
      doMotionStep(currentHeadPosition, currentTailPosition, m.direction);
      const newTailPosition = currentTailPosition;

      // this is just for debugging. if the head is ever too far from the tail... I done messed up
      checkIfHeadTooFarFromTail(currentHeadPosition, currentTailPosition);

      // check if the new position of the tail is the same as before the Motion Step..
      // ..if the position is different, check if the position is unique visit..
      // .. if the position is a unique visit, add it to the list of unique visits
      if (!isOnSamePosition(oldTailPosition, newTailPosition)) {
        let isUniqueVisit = true;
        for (const coord of coordinatesTailVisited) {
          if (isOnSamePosition(coord, newTailPosition)) {
            isUniqueVisit = false;
            break;
          }
        }
        if (isUniqueVisit) {
          coordinatesTailVisited.push([...newTailPosition]);
        }
      }
    }
  }
  return coordinatesTailVisited.length;
}

function doMotionStep(
  head: Coordinate,
  tail: Coordinate,
  direction: Direction
) {
  // do motion from current position of head
  // every time tail is moved, we need to store the new coordinates in an array of tuples if the coordinate tuple is unique to the array
  const onSameCol = isOnSameCol(head, tail);
  const onSameRow = isOnSameRow(head, tail);

  // if head and tail are in same position, just move head and update head's position
  if (onSameCol && onSameRow) {
    moveCoordinateOneStep(head, direction);
    return;
  }

  // if head and tail are on the same row
  if (onSameRow) {
    // set the heads new position
    moveCoordinateOneStep(head, direction);
    // if the motion is left or right, check if the position of head and tail are the same. if not, move the tail.
    if (direction === Direction.Left || direction === Direction.Right) {
      moveTailIfNotCovered(tail, head, direction);
    }
    return;
  }

  // if the head and tail are on the same column
  if (onSameCol) {
    // set the heads new position
    moveCoordinateOneStep(head, direction);
    // if the motion is up or down, check if the position of the head and tail are the same. if not, move the tail.
    if (direction === Direction.Up || direction === Direction.Down) {
      moveTailIfNotCovered(tail, head, direction);
    }
    return;
  }

  // if the head and tail are NOT on the same column and also NOT on the same row
  // get the heads current position as the old position
  const head_fromPosition = [...head];
  // set the heads new position
  moveCoordinateOneStep(head, direction);
  // if the heads new position is on the same row OR the same column as the tail, do not move the tail
  if (isOnSameCol(head, tail) || isOnSameRow(head, tail)) {
    return;
  }
  if (!isOnSameCol(head, tail) && !isOnSameRow(head, tail)) {
    // if the heads new position is NOT on the same row and is also NOT on the same column as the tail, update the tail to the heads old position
    tail[0] = head_fromPosition[0];
    tail[1] = head_fromPosition[1];
    return;
  }
}

function moveTailIfNotCovered(
  tail: Coordinate,
  head: Coordinate,
  direction: Direction
) {
  if (!isOnSamePosition(head, tail)) {
    moveCoordinateOneStep(tail, direction);
  }
}

function moveCoordinateOneStep(coordinate: Coordinate, direction: Direction) {
  switch (direction) {
    case Direction.Up:
      coordinate[1] = coordinate[1] + 1;
      break;
    case Direction.Down:
      coordinate[1] = coordinate[1] - 1;
      break;
    case Direction.Left:
      coordinate[0] = coordinate[0] - 1;
      break;
    case Direction.Right:
      coordinate[0] = coordinate[0] + 1;
      break;
  }
}

function isOnSameRow(coord1: Coordinate, coord2: Coordinate): boolean {
  return coord1[1] === coord2[1];
}
function isOnSameCol(coord1: Coordinate, coord2: Coordinate): boolean {
  return coord1[0] === coord2[0];
}
function isOnSamePosition(coord1: Coordinate, coord: Coordinate): boolean {
  return isOnSameRow(coord1, coord) && isOnSameCol(coord1, coord);
}

// just for testing/debugging code
function checkIfHeadTooFarFromTail(head: Coordinate, tail: Coordinate) {
  const xAxisDistance = head[0] - tail[0];
  if (xAxisDistance > 1 || xAxisDistance < -1) {
    console.log(
      `[X-Axis] Head too far from Tail. Head: ${head}, Tail: ${tail}`
    );
  }
  const yAxisDistance = head[1] - tail[1];
  if (yAxisDistance > 1 || yAxisDistance < 1) {
    `[Y-Axis] Head too far from Tail. Head: ${head}, Tail: ${tail}`;
  }
}

console.log("Answer: ", getPositionsTailVisitedAtLeastOnce(sampleInput));
// wrong, too low: 3166
// wrong, too low: 3167
