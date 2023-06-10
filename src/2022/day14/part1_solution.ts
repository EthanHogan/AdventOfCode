import { sampleInput } from "./input";

const exampleInput = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

class ItemPosition {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

type RockPath = ItemPosition[];
type Offset = {x: number, y: number};

function main() {
    const caveTrace = createMatrixFromTrace(sampleInput);
    // need to start at 500, 0 as our source of sand
    let source: ItemPosition = null;
    for (let i = 0 ; i < caveTrace[0].length; i++) {
        if (caveTrace[0][i] === "+") {
            source = new ItemPosition(i, 0);
        }
    }
    let sandDropped = 0;
    let hasFoundRestingPlace = true;
    while (hasFoundRestingPlace) {
        hasFoundRestingPlace = dropSand(source, caveTrace);
        sandDropped++;
    }

    console.log("Sand dropped: ", sandDropped - 1);
    return sandDropped - 1;
    // need to "drop" one piece of sand at a time
    // move the dropped piece until it comes to "rest"
        // as we move the sand, need to check if the sand can end up outside the matrix.
        // if the sand ends up outside the matrix, we are done. and we need to return the number of dropped pieces of sand - 1  
    // drop another piece of sand 
}
main();
// 179, too low
// 961 ?, YES
type FoundRestingPosition = boolean;
function dropSand(sand: ItemPosition, caveMatrix: string[][]): FoundRestingPosition {
    // check position below, if ".", move there, call dropSand again with new position
    // check position downAndLeft, if ".", move there, call dropSand again with new position
    // check position downAndRight, if ".", move there, call dropSand again with new position
    // return true;
    let below = caveMatrix[sand.y + 1] ? caveMatrix[sand.y + 1][sand.x] : undefined;
    let belowAndLeft = caveMatrix[sand.y + 1] ? caveMatrix[sand.y + 1][sand.x - 1] : undefined;
    let belowAndRight = caveMatrix[sand.y + 1] ? caveMatrix[sand.y + 1][sand.x + 1] : undefined;

    if (!below) {
        return false;
    } else if (below === ".") {
        // move below
        const sandNewPosition = new ItemPosition(sand.x, sand.y + 1)
        moveSandToNewPos(sand, sandNewPosition, caveMatrix)
        return dropSand(sandNewPosition, caveMatrix);
    }

    if (!belowAndLeft) {
        return false;
    } else if (belowAndLeft === ".") {
        // move down and left
        const sandNewPosition = new ItemPosition(sand.x - 1, sand.y + 1);
        moveSandToNewPos(sand, sandNewPosition, caveMatrix);
        return dropSand(sandNewPosition, caveMatrix);
    }

    if (!belowAndRight) {
        return false;
    } else if (belowAndRight === ".") {
        const sandNewPosition = new ItemPosition(sand.x + 1, sand.y + 1);
        moveSandToNewPos(sand, sandNewPosition, caveMatrix);
        return dropSand(sandNewPosition, caveMatrix);
    }

    return true;
}

function moveSandToNewPos(sand: ItemPosition, newPosition: ItemPosition, caveMatrix: string[][]) {
    // set old position to "."
    if (caveMatrix[sand.y][sand.x] !== "+") {
        caveMatrix[sand.y][sand.x] = ".";
    }
    // sand.x = newPosition.x;
    // sand.y = newPosition.y;
    // set new position to "O"
    caveMatrix[newPosition.y][newPosition.x] = "O";
}


function createMatrixFromTrace(rockTraceInput: string) {
    const matrix = [];
    const posOffset: Offset = { x: null, y: null}
    const rockPaths = rockTraceInput.split("\n");
    for (let i = 0; i < rockPaths.length; i++) {
        const currentRockPathStr: string = rockPaths[i];

        const rockPath: RockPath = currentRockPathStr.split(" -> ").map((x) => { 
            const [xCoordStr, yCoordStr] = x.split(",");
            const xCoord: number = parseInt(xCoordStr);
            const yCoord: number = parseInt(yCoordStr);
            return new ItemPosition(xCoord, yCoord); 
        }); // [Rock, Rock, Rock] // Rock = {x: number, y:number}

        for (let j = 0; j < rockPath.length; j++) {
            const currentRock = rockPath[j];
            const nextRock = rockPath[j + 1];
            if (matrix.length === 0) {
                posOffset.y = currentRock.y;
                posOffset.x = currentRock.x;
            }
            if (nextRock) {
                addRocksFromStartUpToEnd(currentRock, nextRock, matrix, posOffset);
            } else {
                placeItem("#", currentRock, matrix, posOffset)
            }
        };
    }
    const sandEntryPoint = {x: 500, y: 0};
    placeItem("+", sandEntryPoint, matrix, posOffset);
    return matrix;
}

function addRocksFromStartUpToEnd (startRock: ItemPosition, endRock: ItemPosition, matrix: string[][], posOffset: Offset) {
    if (endRock.y > startRock.y) {
        for (let i = startRock.y; i < endRock.y; i++) {
            const newRock = new ItemPosition(startRock.x, i);
            placeItem("#", newRock, matrix, posOffset);
        }
        return;
    }

    if (endRock.y < startRock.y) {
        for (let i = startRock.y; i > endRock.y; i--) {
            const newRock = new ItemPosition(startRock.x, i);
            placeItem("#", newRock, matrix, posOffset);
        }
        return;
    }

    if (endRock.x > startRock.x) {
        for (let i = startRock.x; i < endRock.x; i++) {
            const newRock = new ItemPosition(i, startRock.y);
            placeItem("#", newRock, matrix, posOffset);
        }
        return;
    }

    if (endRock.x < startRock.x) {
        for (let i = startRock.x; i > endRock.x; i--) {
            const newRock = new ItemPosition(i, startRock.y);
            placeItem("#", newRock, matrix, posOffset);
        }
        return;
    }
}

function placeItem(item: string, rock: ItemPosition, matrix: string[][], posOffset: Offset) {
    let xPos = rock.x - posOffset.x;
    let yPos = rock.y - posOffset.y;
    if (xPos >= 0 && yPos >= 0 && matrix[yPos] && matrix[yPos][xPos]) {
        // rock is already in bounds, just place it.
        matrix[yPos][xPos] = item;
        return;
    }

    const newRow = matrix.length === 0 ? ["."] : matrix[0].map((x) => ".");
    if (yPos < 0) {
        // need to add more rows to beginning of matrix
        let ySpotsToAdd = yPos * -1;
        while (ySpotsToAdd > 0) {
            matrix.unshift([...newRow]);
            ySpotsToAdd--;
        }
        posOffset.y = rock.y;
        yPos = 0;
    } else if (yPos >= matrix.length) {
        // need to add more rows to end of matrix
        let ySpotsToAdd = yPos - matrix.length + 1;
        while (ySpotsToAdd > 0) {
            matrix.push([...newRow]);
            ySpotsToAdd--;
        }
    }

    if (xPos < 0) {
        // need to add more cols to beginning of each row
        let xSpotsToAdd = xPos * -1;

        while (xSpotsToAdd > 0) {
            for (const row of matrix) {
                row.unshift(".");
            }
            xSpotsToAdd--;
        }
        posOffset.x = rock.x;
        xPos = 0;
    } else if (xPos >= matrix[0].length) {
        // need to add more cols to end of each row
        let xSpotsToAdd = xPos - matrix[0].length + 1;
        while (xSpotsToAdd > 0) {
            for (const row of matrix) {
                row.push(".");
            }
            xSpotsToAdd--;
        }
    }

    matrix[yPos][xPos] = item;
}
