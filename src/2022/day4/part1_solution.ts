import { sampleInput } from "./input";

const exampleInput = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`;

class ElfAssignments {
  start: number;
  end: number;
}

function getPairsWhereOneFullyContainsTheOther(input: string): number {
  let totalFullAssignmentOverlaps = 0;
  const listOfElfAssignmentTuples =
    parseInputIntoListOfElfAssignmentTuples(input);
  // iterate over list of tuples
  listOfElfAssignmentTuples.forEach((eat) => {
    // check if ones assignments fully contain the others
    if (doesOneAssignmentsFullyContainTheOther(eat[0], eat[1])) {
      // if yes, add to the count
      totalFullAssignmentOverlaps++;
    }
    // if no, continue
  });

  return totalFullAssignmentOverlaps;
}

function doesOneAssignmentsFullyContainTheOther(
  ea1: ElfAssignments,
  ea2: ElfAssignments
): boolean {
  // if the starts of each are equal, then one list does contain the other
  if (ea1.start === ea2.start) return true;
  // if the start of the 1st is less than the 2nd, then the end of the 1st has to be greater than or equal to 2nd
  if (ea1.start < ea2.start && ea1.end >= ea2.end) return true;
  // if the start of the 1st is greater than the 2nd, then the end of the 1st has to be less than or equal to the 2nd
  if (ea1.start > ea2.start && ea1.end <= ea2.end) return true;

  return false;
}

function parseInputIntoListOfElfAssignmentTuples(
  input: string
): ElfAssignments[][] {
  const result = [];
  // split into pairs ["2-4,6-8", "2-3,4-5",...]
  const assignmentPairStrs = input.split("\n");
  // interate over pairs, build array of ElfAssignmentTuples
  const listOfElfAssignmentTuples: ElfAssignments[][] = assignmentPairStrs.map(
    (ap) => {
      const elfAssignmentTuple = [];
      const listOfAssignmentStr = ap.split(",");
      // ["2-4", "6-8"]
      const assignmentStr1 = listOfAssignmentStr[0];
      const assignmentStr2 = listOfAssignmentStr[1];

      elfAssignmentTuple.push(
        createElfAssignmentsFromAssignmentStr(assignmentStr1)
      );
      elfAssignmentTuple.push(
        createElfAssignmentsFromAssignmentStr(assignmentStr2)
      );

      return elfAssignmentTuple;
    }
  );

  return listOfElfAssignmentTuples;

  function createElfAssignmentsFromAssignmentStr(assigmentStr: string) {
    const result: ElfAssignments = new ElfAssignments();
    const assignmentList = assigmentStr.split("-");
    result.start = parseInt(assignmentList[0]);
    result.end = parseInt(assignmentList[1]);
    return result;
  }
  // final form [[EA, EA], [EA, EA]]
}

console.log("Answer: ", getPairsWhereOneFullyContainsTheOther(sampleInput));
