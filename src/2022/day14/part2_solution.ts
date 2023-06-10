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
type CaveScan = string[][];

function main(): number {
    const caveScan: CaveScan = createMatrixFromTrace(sampleInput);
    let sandDropped = 0;
    const floorYPosition = caveScan.length + 1;
    while (true) {
        const source = getSourcePosition(caveScan);
        const restingPositionOfSand = dropSand(source, caveScan, floorYPosition);
        sandDropped++;
        // check if restingPosition is same as source
        if (restingPositionOfSand.x === source.x && restingPositionOfSand.y === source.y) {
            break;
        }
    }

    console.log("Sand dropped: ", sandDropped);
    return sandDropped;
}
main();
// 26375

function getSourcePosition(caveScan: CaveScan): ItemPosition {
    for (let i = 0 ; i < caveScan[0].length; i++) {
        if (caveScan[0][i] === "+") {
            return new ItemPosition(i, 0);
        }
    }
}

function dropSand(sand: ItemPosition, caveMatrix: string[][], floorYPosition: number): ItemPosition {
    // check position below, if ".", move there, call dropSand again with new position
    // check position downAndLeft, if ".", move there, call dropSand again with new position
    // check position downAndRight, if ".", move there, call dropSand again with new position
    
    // check if the next tile down is the floor
    if (sand.y + 1 === floorYPosition) {
        return sand;
    }
    let below = caveMatrix[sand.y + 1] ? caveMatrix[sand.y + 1][sand.x] : undefined;
    let belowAndLeft = caveMatrix[sand.y + 1] ? caveMatrix[sand.y + 1][sand.x - 1] : undefined;
    let belowAndRight = caveMatrix[sand.y + 1] ? caveMatrix[sand.y + 1][sand.x + 1] : undefined;

    if (below === "." || below === undefined) {
        // move below
        const sandNewPosition = new ItemPosition(sand.x, sand.y + 1)
        moveSandToNewPos(sand, sandNewPosition, caveMatrix)
        return dropSand(sandNewPosition, caveMatrix, floorYPosition);
    }

    if (belowAndLeft === "." || belowAndLeft === undefined) {
        // move down and left
        const sandNewPosition = new ItemPosition(sand.x - 1, sand.y + 1);
        moveSandToNewPos(sand, sandNewPosition, caveMatrix);
        return dropSand(sandNewPosition, caveMatrix, floorYPosition);
    }

    if (belowAndRight === "." || belowAndRight === undefined) {
        // move down and right
        const sandNewPosition = new ItemPosition(sand.x + 1, sand.y + 1);
        moveSandToNewPos(sand, sandNewPosition, caveMatrix);
        return dropSand(sandNewPosition, caveMatrix, floorYPosition);
    }

    return {...sand};
}

function moveSandToNewPos(sand: ItemPosition, newPosition: ItemPosition, caveMatrix: string[][]) {
    // set old position to "."
    if (caveMatrix[sand.y][sand.x] !== "+") {
        caveMatrix[sand.y][sand.x] = ".";
    }
    // set new position to "O"
    const placedItemPosition = placeItem("O", newPosition, caveMatrix, {x: 0, y:0});
    newPosition.x = placedItemPosition.x;
    newPosition.y = placedItemPosition.y;
}


function createMatrixFromTrace(rockTraceInput: string): CaveScan {
    const matrix: CaveScan = [];
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

function addRocksFromStartUpToEnd (startRock: ItemPosition, endRock: ItemPosition, caveScan: CaveScan, posOffset: Offset): undefined {
    if (endRock.y > startRock.y) {
        for (let i = startRock.y; i < endRock.y; i++) {
            const newRock = new ItemPosition(startRock.x, i);
            placeItem("#", newRock, caveScan, posOffset);
        }
        return;
    }

    if (endRock.y < startRock.y) {
        for (let i = startRock.y; i > endRock.y; i--) {
            const newRock = new ItemPosition(startRock.x, i);
            placeItem("#", newRock, caveScan, posOffset);
        }
        return;
    }

    if (endRock.x > startRock.x) {
        for (let i = startRock.x; i < endRock.x; i++) {
            const newRock = new ItemPosition(i, startRock.y);
            placeItem("#", newRock, caveScan, posOffset);
        }
        return;
    }

    if (endRock.x < startRock.x) {
        for (let i = startRock.x; i > endRock.x; i--) {
            const newRock = new ItemPosition(i, startRock.y);
            placeItem("#", newRock, caveScan, posOffset);
        }
        return;
    }
}

// places the item, expanding the matrix to place item if needed
function placeItem(item: string, rock: ItemPosition, caveScan: CaveScan, posOffset: Offset): ItemPosition {
    let xPos = rock.x - posOffset.x;
    let yPos = rock.y - posOffset.y;
    if (xPos >= 0 && yPos >= 0 && caveScan[yPos] && caveScan[yPos][xPos]) {
        // rock is already in bounds, just place it.
        caveScan[yPos][xPos] = item;
        return new ItemPosition(xPos, yPos);
    }

    const newRow = caveScan.length === 0 ? ["."] : caveScan[0].map((x) => ".");
    if (yPos < 0) {
        // need to add more rows to beginning of matrix
        let ySpotsToAdd = yPos * -1;
        while (ySpotsToAdd > 0) {
            caveScan.unshift([...newRow]);
            ySpotsToAdd--;
        }
        posOffset.y = rock.y;
        yPos = 0;
    } else if (yPos >= caveScan.length) {
        // need to add more rows to end of matrix
        let ySpotsToAdd = yPos - caveScan.length + 1;
        while (ySpotsToAdd > 0) {
            caveScan.push([...newRow]);
            ySpotsToAdd--;
        }
    }

    if (xPos < 0) {
        // need to add more cols to beginning of each row
        let xSpotsToAdd = xPos * -1;

        while (xSpotsToAdd > 0) {
            for (const row of caveScan) {
                row.unshift(".");
            }
            xSpotsToAdd--;
        }
        posOffset.x = rock.x;
        xPos = 0;
    } else if (xPos >= caveScan[0].length) {
        // need to add more cols to end of each row
        let xSpotsToAdd = xPos - caveScan[0].length + 1;
        while (xSpotsToAdd > 0) {
            for (const row of caveScan) {
                row.push(".");
            }
            xSpotsToAdd--;
        }
    }

    caveScan[yPos][xPos] = item;
    return new ItemPosition(xPos, yPos);
}
