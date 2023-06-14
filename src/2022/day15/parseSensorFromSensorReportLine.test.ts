import {describe, expect, test} from '@jest/globals';
import { parseSensorFromSensorReportLine, Sensor, Beacon} from './part1_solution';

describe('parseSensorFromSensorReportLine', () => {
  let sensorReportLine = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15`;
  let resultBeacon: Beacon = new Beacon(-2, 15);
  let result = new Sensor(2, 18, resultBeacon);
  test('should parse', () => {
    expect(parseSensorFromSensorReportLine(sensorReportLine)).toEqual(result);
  });

  sensorReportLine = `Sensor at x=2, y=0: closest beacon is at x=2, y=10`;
  resultBeacon = new Beacon(2, 10);
  result = new Sensor(2, 0, resultBeacon);
  test('should parse', () => {
    expect(parseSensorFromSensorReportLine(sensorReportLine)).toEqual(result);
  });

  sensorReportLine = `Sensor at x=14, y=17: closest beacon is at x=10, y=16`;
  resultBeacon = new Beacon(10, 16);
  result = new Sensor(14, 17, resultBeacon);
  test('should parse', () => {
    expect(parseSensorFromSensorReportLine(sensorReportLine)).toEqual(result);
  });
})