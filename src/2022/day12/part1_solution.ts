import { sampleInput} from "./input";

const exampleInput = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;


type HeightMap = Elevation[][];
type Path = Elevation[];
class Position {
    row: number;
    column: number;
    constructor(row: number, column: number) {
        this.row = row;
        this.column = column;
    }
}

class Elevation {
    symbol: string;
    value: number;
    position: Position;
    stepsTakenToReach: number = null;
    constructor(symbol: string, value: number, position: Position) {
        this.symbol = symbol;
        this.value = value;
        this.position = position;
    }
}

console.log("Answer: ", findFewestStepsToBestSignal(sampleInput));

function findFewestStepsToBestSignal(heightMapInput: string): number {
    const heightMap: HeightMap = parseHeightMapStrIntoElevationMatrix(heightMapInput);
    // find the start on the height map
    const start: Elevation = getElevationBySymbol("S", heightMap);
    const pathsToEnd = findPathsFromStartToEnd(start, heightMap).sort((a,b) => a.length - b.length);
    return pathsToEnd[0].length - 1;
}

function parseHeightMapStrIntoElevationMatrix(heightMapInput: string): HeightMap {
    const heightMap: HeightMap = [];
    const rows = heightMapInput.split("\n"); // ['Sabqponm', 'abcryxxl', ...]
    const elevationsOrdered: string[] = 'SabcdefghijklmnopqrstuvwxyzE'.split("");
    for (let r = 0; r < rows.length; r++) {
        const currentRow = rows[r];
        const newRow = [];
        for (let c = 0; c < currentRow.length; c++) {
            const symbol = currentRow[c];
            const valueOfSymbol = elevationsOrdered.findIndex((e) => e === symbol);
            const position = new Position(r, c);
            const elevation = new Elevation(symbol, valueOfSymbol, position)
            newRow.push(elevation);
        }
        heightMap.push(newRow);
    }
    return heightMap;
}

function getElevationBySymbol(symbol: string, heightMap: HeightMap): Elevation {
    let elevationOfSymbol: Elevation = null;
    for (let r = 0; r < heightMap.length; r++) {
        const row = heightMap[r];
        for (let c = 0; c < row.length; c++) {
            const column = c;
            const currentElevation = row[column];
            if (currentElevation.symbol === symbol) {
                return currentElevation;
            }
        }
    }
    // if the return does happen, then the symbol is not it the list and this will return null
    return elevationOfSymbol;
}

function findPathsFromStartToEnd(start: Elevation, heightMap: HeightMap): Path[] {
    const pathsToEnd: Path[] = []; 
    const path: Elevation[] = [];
    function takeNextStepFromCurrentPosition (current: Elevation, currentPath: Elevation[]) {
        currentPath.push(current);
        current.stepsTakenToReach = currentPath.length - 1;

        if (current.symbol === 'E') {
            pathsToEnd.push(currentPath);
            return;
        }

        const stepUp: Elevation = current.position.row === 0 ? null : heightMap[current.position.row - 1][current.position.column];
        const stepDown: Elevation = current.position.row === (heightMap.length - 1) ? null : heightMap[current.position.row + 1][current.position.column];
        const stepLeft: Elevation = current.position.column === 0 ? null : heightMap[current.position.row][current.position.column - 1];
        const stepRight: Elevation = current.position.column === (heightMap[current.position.row].length - 1) ? null : heightMap[current.position.row][current.position.column + 1];

        takeStepIfPossible(current, stepUp);
        takeStepIfPossible(current, stepDown);
        takeStepIfPossible(current, stepLeft);
        takeStepIfPossible(current, stepRight);

        function takeStepIfPossible(currentStep: Elevation, nextStep: Elevation) {
            if (canTakeStep(currentStep, nextStep) && hasNextStepBeenTakenSlower(currentStep, nextStep)){
                takeNextStepFromCurrentPosition(nextStep, [...currentPath]);
            } 
        }
    }

    takeNextStepFromCurrentPosition(start, [...path]);
    return pathsToEnd;
}

function canTakeStep (current: Elevation, next: Elevation): boolean {
    return next && next.value - current.value <= 1;
}

function hasNextStepBeenTakenSlower(current: Elevation, next: Elevation): boolean {
    if (next.stepsTakenToReach === null) return true;
    return next && next.stepsTakenToReach > current.stepsTakenToReach + 1;
}
