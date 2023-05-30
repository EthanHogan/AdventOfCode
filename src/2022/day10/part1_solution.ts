import { sampleInput } from "./input";

const exampleInput = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;

class Instruction {
  cycles: number;
  signalEffect: number;

  constructor(iCycles: number, iSignalEffect: number) {
    this.cycles = iCycles;
    this.signalEffect = iSignalEffect;
  }
}

enum InstructionToCyclesMap {
  noop = 1,
  addx = 2,
}

function sumOfSignalStrengthsEveryNCycle(
  programInput: string,
  firstInterestingCycle: number,
  nCyclesBetweenInterestingCycles: number
) {
  let sum = 0;
  const instructions =
    parseInstructionsFromProgramInput(programInput).reverse();
  let currentCycle = 0;
  let register = 1;

  while (instructions.length > 0) {
    currentCycle++;
    // check if on the Nth cycle. if yes, multiply the cycle number by the register value and add it to the result sum
    const ifFirstInterestingCycle = currentCycle === firstInterestingCycle;
    const isAfterFirstInterestingCycle = currentCycle > firstInterestingCycle;
    const isCycleNCyclesAfterLastInterestingCycle = (currentCycle - firstInterestingCycle) % nCyclesBetweenInterestingCycles === 0;
    if (ifFirstInterestingCycle || (isAfterFirstInterestingCycle && isCycleNCyclesAfterLastInterestingCycle)) {
      sum += currentCycle * register;
    }

    // get the current instruction (the last instruction in the reversed array)
    const currentInstruction = instructions.at(-1);

    // decrement the instruction's cycles by 1
    currentInstruction.cycles--;

    // if the instruction's cycles is 0, the instruction has finished execution, so add its signal strength to the register
    if (currentInstruction.cycles === 0) {
      register += currentInstruction.signalEffect;
      instructions.pop();
    }
  }
  return sum;
}

function parseInstructionsFromProgramInput(programInput: string) {
  const instructions: Instruction[] = [];

  const instructionLineStrs = programInput.split("\n");

  for (const i of instructionLineStrs) {
    const instructionTuple = i.split(" ");
    const cycles: number = InstructionToCyclesMap[instructionTuple[0]];
    const signalEffect: number = parseInt(instructionTuple[1]);
    instructions.push(
      new Instruction(cycles, isNaN(signalEffect) ? 0 : signalEffect)
    );
  }
  return instructions;
}

console.log("Answer: ", sumOfSignalStrengthsEveryNCycle(sampleInput, 20, 40));
