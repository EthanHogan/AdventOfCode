import { sampleInput } from "./input";

const exampleInput = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

const shorterExampleInput = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1`;

type Stack = string[];

class Procedure {
  numCratesToMove: number;
  from_postion: number;
  to_postion: number;
}

type StacksAndProcedures = {
  stacks: Stack[];
  procedures: Procedure[];
};
function getTopCrateOfEachStack(input: string): string {
  const parsedStacksAndProcedures: StacksAndProcedures =
    parseInputIntoStacksAndProcedures(input);

  // execute the procedures on the stacks
  for (const p of parsedStacksAndProcedures.procedures) {
    executeProcedureOnStacks(p, parsedStacksAndProcedures.stacks);
  }

  // determine which box is on top of each stack, generate this as a ordered string.
  return generateTopOfEachStackString(parsedStacksAndProcedures.stacks);
}

function generateTopOfEachStackString(stacks: Stack[]): string {
  let result = "";

  for (const s of stacks) {
    if (s.length === 0) {
      continue;
    }
    const topCrate = s[s.length - 1];
    result = result + topCrate;
  }

  return result;
}

function executeProcedureOnStacks(
  procedure: Procedure,
  stacks: Stack[]
): Stack[] {
  // remove the number of crates from the `from` top of stack (end of the array)
  const stackToRemoveFrom = stacks[procedure.from_postion - 1];
  const cratesTakenFromStack = stackToRemoveFrom.splice(
    procedure.numCratesToMove * -1,
    procedure.numCratesToMove
  );
  // DONT reverse the order because we are using a crane to move the stacks now. :)
  //cratesTakenFromStack.reverse();

  // add the crates to the top of the `to` stack
  let stackToAddTo = stacks[procedure.to_postion - 1];
  const crateAddToStack = stackToAddTo.concat(cratesTakenFromStack);
  stacks[procedure.to_postion - 1] = crateAddToStack;
  return stacks;
}

function parseInputIntoStacksAndProcedures(input: string): StacksAndProcedures {
  const result: StacksAndProcedures = { stacks: null, procedures: null };
  // split up the stacks and procedures
  const splitStacksAndProcedures = input.split("\n\n");
  const stacksAndStackNumberStr = splitStacksAndProcedures[0];
  const proceduresStr = splitStacksAndProcedures[1];
  // parse a list of Stacks from the stacksAndStackNumberStr
  result.stacks = parseListOfStacks_FromStacksStr(stacksAndStackNumberStr);
  // parse a list of Procedures from the proceduresStr
  result.procedures = parseListOfProcedures_FromProcedureStr(proceduresStr);
  return result;

  //   const mockEndResult = {
  //     stacks: [["Z", "N"], ["M", "C", "D"], ["P"]],
  //     procedures: [
  //       {
  //         numCratesToMove: 1,
  //         from: 2,
  //         to: 1,
  //       },
  //       {
  //         numCratesToMove: 3,
  //         from: 1,
  //         to: 3
  //       },
  //     //   ...
  //     ],
  //   };
}

function parseListOfStacks_FromStacksStr(stacksStr: string): Stack[] {
  // get stack numbers and positions of the stack numbers index
  const stackNumberAndPositionTuples: number[][] = [];
  // split string by line
  const splitByLine = stacksStr.split("\n");
  // get the last line
  const stackNumberLine = splitByLine[splitByLine.length - 1];
  // iterate through the string, add a number and its index to the stackNumberAndPostionTuples when you find one
  for (let i = 0; i < stackNumberLine.length; i++) {
    if (stackNumberLine[i] && parseInt(stackNumberLine[i])) {
      stackNumberAndPositionTuples.push([parseInt(stackNumberLine[i]), i]);
    }
  }

  const result: Stack[] = [];
  // iterate through the strings split by line, do not iterate on last line (the stack number line)
  for (let i = 0; i < splitByLine.length - 1; i++) {
    // iterate over the stackNumberAndPositionTuples
    for (let j = 0; j < stackNumberAndPositionTuples.length; j++) {
      const stackNumber = stackNumberAndPositionTuples[j][0];
      const stackPosition = stackNumberAndPositionTuples[j][1];

      const crate = splitByLine[i][stackPosition];

      if (!result[stackNumber - 1]) {
        result.push([]);
      }

      if (!(crate === " ")) {
        result[stackNumber - 1].unshift(crate);
      }
    }
  }
  return result;
}

function parseListOfProcedures_FromProcedureStr(
  procedureStr: string
): Procedure[] {
  const procedures_removedWords = procedureStr
    .replaceAll("move ", "")
    .replaceAll(" from ", ",")
    .replaceAll(" to ", ",");

  const procedure_listOfNumsAndCommasStrings =
    procedures_removedWords.split("\n");

  let listOfProcedures: Procedure[] = procedure_listOfNumsAndCommasStrings.map(
    (x) => {
      const numbersOnlyList = x.split(",");
      const procedure = new Procedure();
      procedure.numCratesToMove = parseInt(numbersOnlyList[0]);
      procedure.from_postion = parseInt(numbersOnlyList[1]);
      procedure.to_postion = parseInt(numbersOnlyList[2]);
      return procedure;
    }
  );

  return listOfProcedures;
}

console.log("Answer: ", getTopCrateOfEachStack(sampleInput));
