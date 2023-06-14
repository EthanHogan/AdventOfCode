import { sampleInput } from "./input";

const exampleInput = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`;

type Location = { x: number, y: number }

export class Beacon {
    location: Location;
    constructor(xLocation: number, yLocation: number) {
        this.location = {x: xLocation, y: yLocation};
    }
}

export class Sensor {
    location: Location;
    nearestBeacon: Beacon;
    
    constructor(xLocation: number, yLocation: number, nearestBeacon: Beacon) {
        this.location = {x: xLocation, y: yLocation};
        this.nearestBeacon = nearestBeacon;
    }

    distanceToNearestBeacon(): number {
        const xDistance = 
            this.location.x >= this.nearestBeacon.location.x ?
            this.location.x - this.nearestBeacon.location.x :
            this.nearestBeacon.location.x - this.location.x;
        
        const yDistance = 
            this.location.y >= this.nearestBeacon.location.y ?
            this.location.y - this.nearestBeacon.location.y :
            this.nearestBeacon.location.y - this.location.y;
        
        return xDistance + yDistance;
    };

}

type SensorRange = "#";
type EmptySlot = ".";
type MatrixItem = SensorRange | EmptySlot | Sensor | Beacon;
type Matrix = MatrixItem[][];

let beaconsOrSensorsDrawnOnRow= {};
let sensorRadiusTuples: [number, number][]= [];

function main(input: string, rowNumberToCheck: number): void
{
    const sensors = getSensorsFromSensorReport(input);
    const matrix: Matrix = [];
    const offset: Location = { x: null, y: null };
    sensors.forEach((sensor) => {
        placeItemInMatrix(sensor, sensor.location, matrix, offset, rowNumberToCheck);
        placeItemInMatrix(sensor.nearestBeacon, sensor.nearestBeacon.location, matrix, offset, rowNumberToCheck);
        drawSensorRadius(sensor, matrix, offset, rowNumberToCheck);
    });
    const blockedSpaces = countUniqueNumbersInRanges(sensorRadiusTuples);
    let numBeaconsOnRow = 0; 
    for (let x in beaconsOrSensorsDrawnOnRow) {
        numBeaconsOnRow++;
    }
    const coveredSpotsOnRow = blockedSpaces - numBeaconsOnRow;
    console.log(`covered spots on row ${rowNumberToCheck}: `, coveredSpotsOnRow);
    // console.log(matrix);
}
main(sampleInput, 2000000);
// main(exampleInput, 10);

function countUniqueNumbersInRanges(ranges: [number, number][]): number {
    // Sort ranges by the starting number
    ranges.sort((a, b) => a[0] - b[0]);
  
    let mergedRanges: [number, number][] = [];
    let previousRange: [number, number] = ranges[0];
  
    // Merge overlapping ranges
    for (let i = 1; i < ranges.length; i++) {
      let currentRange = ranges[i];
  
      if (previousRange[1] >= currentRange[0]) { // Ranges overlap
        previousRange[1] = Math.max(previousRange[1], currentRange[1]);
      } else { // Ranges do not overlap
        mergedRanges.push(previousRange);
        previousRange = currentRange;
      }
    }
  
    mergedRanges.push(previousRange);
  
    // Count unique numbers by calculating length of each range
    let uniqueNumbers = 0;
    for (let range of mergedRanges) {
      uniqueNumbers += range[1] - range[0] + 1;
    }
  
    return uniqueNumbers;
  }


function drawSensorRadius(sensor: Sensor, matrix: Matrix, offset: Location, rowNumberToCheck: number): void {
    const distanceBetween = sensor.distanceToNearestBeacon();
    const isYTooFarUp = sensor.location.y > rowNumberToCheck && sensor.location.y - distanceBetween > rowNumberToCheck;
    const isYTooFarDown = sensor.location.y < rowNumberToCheck && rowNumberToCheck - distanceBetween > sensor.location.y
    if (isYTooFarUp || isYTooFarDown) {
        return;
    }
    let yDiff = rowNumberToCheck - sensor.location.y;
    const maxXDif = yDiff >= 0 ? distanceBetween - yDiff : distanceBetween - (yDiff * -1);
    sensorRadiusTuples.push([sensor.location.x - maxXDif, sensor.location.x + maxXDif])
    // for (let xDiff = maxXDif; xDiff >= (maxXDif * -1) || (xDiff === 0 && maxXDif === 0); xDiff--) {
    //     const newSensorRadiusLocation: Location = {x: sensor.location.x + xDiff, y: sensor.location.y + yDiff};
    //     // console.log("Xdiff: ", xDiff, "yDiff: ", yDiff, "Sum: ", xDiff + yDiff);
    //     placeItemInMatrix("#", newSensorRadiusLocation, matrix, offset, rowNumberToCheck);
    // }

    // for(let yDiff = distanceBetween; yDiff >= (distanceBetween * -1); yDiff--) {
    //     const maxXDif = yDiff >= 0 ? distanceBetween - yDiff : distanceBetween - (yDiff * -1);
    //     for (let xDiff = maxXDif; xDiff >= (maxXDif * -1) || (xDiff === 0 && maxXDif === 0); xDiff--) {
    //         const newSensorRadiusLocation: Location = {x: sensor.location.x + xDiff, y: sensor.location.y + yDiff};
    //         // console.log("Xdiff: ", xDiff, "yDiff: ", yDiff, "Sum: ", xDiff + yDiff);
    //         placeItemInMatrix("#", newSensorRadiusLocation, matrix, offset, rowNumberToCheck);
    //     }
    // }
}

function placeItemInMatrix(item: MatrixItem, noOffsetLocation: Location, matrix: Matrix, offset: Location, rowToDrawOn: number ) {
    if (noOffsetLocation.y !== rowToDrawOn) {
        return;
    }
    if (offset.x === null) {
        offset.x = noOffsetLocation.x;
        offset.y = noOffsetLocation.y;
    }
    const locationInMatrix: Location = {
        x: noOffsetLocation.x - offset.x, 
        y: noOffsetLocation.y - offset.y
    };

    let newRow;
    const emptySlot: EmptySlot = ".";
    if (matrix.length === 0) {
        newRow = ["."];
    } else {
        newRow = matrix[0].map(() => emptySlot);
    }
    if (locationInMatrix.y < 0) {
        // if (item === "#") return;
        // add rows to beginning of matrix
        let rowsToAdd = locationInMatrix.y * -1;
        while (rowsToAdd > 0) {
            rowsToAdd--;
            matrix.unshift([...newRow])
        }
        // set locationInMatrix y to 0;
        locationInMatrix.y = 0;
        // set the offset y to this item's no offset Y 
        offset.y = noOffsetLocation.y;
    } else if (locationInMatrix.y >= matrix.length) {
        // if (item === "#") return;
        // add rows to end of matrix
        let rowsToAdd = locationInMatrix.y - matrix.length  + 1;
        while (rowsToAdd > 0) {
            rowsToAdd--;
            matrix.push([...newRow]);
        }
    }
    
    if (locationInMatrix.x < 0) {
        // if (item === "#") return;
        // add new col to begninning of each row
        let colsToAdd = locationInMatrix.x * -1;
        while (colsToAdd > 0) {
            colsToAdd--;
            matrix.forEach((row) => row.unshift(emptySlot));
        }
        // set locationInMatrix x to 0
        locationInMatrix.x = 0;
        // set the offset x to this item's no offest X
        offset.x = noOffsetLocation.x;
    } else if (locationInMatrix.x >= matrix[locationInMatrix.y].length) {
        // if (item === "#") return;
        // add new col to end of each row
        let colsToAdd = locationInMatrix.x - matrix[locationInMatrix.y].length  + 1;
        while (colsToAdd){
            colsToAdd--;
            matrix.forEach((row) => row.push(emptySlot));
        }
    }

    if (item === "#" && (matrix[locationInMatrix.y][locationInMatrix.x] instanceof Sensor || matrix[locationInMatrix.y][locationInMatrix.x] instanceof Beacon)) {
        return;
    }
    if (item instanceof Beacon || item instanceof Sensor) {
        beaconsOrSensorsDrawnOnRow[noOffsetLocation.x] = true;
    }
    matrix[locationInMatrix.y][locationInMatrix.x] = item;
}

function getSensorsFromSensorReport(sensorReport: string): Sensor[] {
    const reportLines = sensorReport.split("\n");
    const sensors: Sensor[] = reportLines.map((r) => {
        return parseSensorFromSensorReportLine(r);
    })
    return sensors;
}

export function parseSensorFromSensorReportLine(sensorReportLine: string): Sensor {
    const [sensorStr, beaconStr] = sensorReportLine.replace("Sensor at", "").replace(" closest beacon is at ", "").split(":");
    const [sensorXStr, sensorYStr] = sensorStr.replace("x=", "").replace(", ", ",").replace("y=", "").split(",");
    const [beaconXStr, beaconYStr] = beaconStr.replace("x=", "").replace(", ", ",").replace("y=", "").split(",");
    const beacon = new Beacon(parseInt(beaconXStr), parseInt(beaconYStr));
    const sensor = new Sensor(parseInt(sensorXStr), parseInt(sensorYStr), beacon);
    return sensor;
}


