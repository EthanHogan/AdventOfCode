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

type Sprite = {start: number, end: number};

// Every cycle a pixel is drawn, the question is should it be a "#"" or a "."
// The pixel drawn is determined based on the sprites position in the row. 
// If the sprite is currently overlapping with the pixel being drawn, then a "#" is drawn.
// Otherwise, a "." is drawn

// A new row begins being generated at the start of the program.
// Once the firstInterestingCycle or the Nth cycle after the firstInterestingCycle is executing, the generated row is added to the result and we begin generating a new row

// the position of the sprite is updated each time an instruction is complete.
// X is still updated on the completion of a cycle
// the middle of sprite is to be position at the horizontal index of equivalent of X in the row.

function imageGeneratedByProgram(
  programInput: string,
  crtWidth: number
) {
    let image = [];
    const instructions =
        parseInstructionsFromProgramInput(programInput).reverse();
    let currentCycle = 0;
    let currentRow = "";
    let sprite: Sprite = {start: 0, end: 2};

    while (instructions.length > 0) {
        // increment the current cycle by 1
        currentCycle++;

        // get the position of the next pixel to be drawn
        let positionOfNextPixelDrawn = currentRow.length;

        // check if this going to be the last cycle of the last instruction to make sure we print the image before exiting the loop
        const isLastInstructionCycle = instructions.length === 1 && instructions[0].cycles === 1;
        // check if the next pixel drawn needs to be on a new row
        if (positionOfNextPixelDrawn >= crtWidth || isLastInstructionCycle) {
            // add the currentRow to the image
            image.push(currentRow);
            // start generating a new row
            currentRow = "";
            // set position of the next pixel to be the beginning of the new row
            positionOfNextPixelDrawn = 0;
        }
        
        // draw # if the next pixel drawn is overlapping with the position of the sprite.
        // draw . if the next pixel drawn is NOT overlapping with the position of the sprite.
        if (positionOfNextPixelDrawn >= sprite.start && positionOfNextPixelDrawn <= sprite.end) {
            currentRow += "#";
        } else {
            currentRow += ".";
        }

        // get the current instruction (the last instruction in the reversed array)
        const currentInstruction = instructions.at(-1);

        // decrement the instruction's cycles by 1
        currentInstruction.cycles--;

        // if the instruction's cycles is 0, the instruction has finished execution, so add its signal strength to the register
        if (currentInstruction.cycles === 0) {
            // set the sprite position so that the middle of the sprite is located at the current middle position of it self + the value of the signal effect in the current instruction
            const currentMiddleOfSprite = sprite.end - 1;
            const newMiddleOfSprite = currentMiddleOfSprite + currentInstruction.signalEffect;
            sprite.start = newMiddleOfSprite - 1;
            sprite.end = newMiddleOfSprite + 1;
            // remove the instruction from the stack
            instructions.pop();
        }
    }
    return image;
}

function parseInstructionsFromProgramInput(programInput: string) {
  const instructions: Instruction[] = [];

  const instructionLineStrs = programInput.split("\n"); // ["addx 15", "noop", "addx -11",...]

  for (const i of instructionLineStrs) {
    const instructionTuple = i.split(" "); // ["addx", "15"]
    const cycles: number = InstructionToCyclesMap[instructionTuple[0]];
    const signalEffect: number = parseInt(instructionTuple[1]);
    instructions.push(
      new Instruction(cycles, isNaN(signalEffect) ? 0 : signalEffect)
    );
  }
  return instructions;
}

console.log("Answer: ", imageGeneratedByProgram(sampleInput, 40));
// wrong answer: FKRHPID
// correct answer: EKRHEPUZ

// WRONG
// [
//     '####.#..#.###..#..#.####.###..#..#.####.',
//     '#....#.#..#..#.#..#.#....#..#.#..#....#.',
//     '###..##...#..#.####.###..#..#.#..#...#..',
//     '#....#.#..###..#..#.#....###..#..#..#...',
//     '#....#.#..#.#..#..#.#....#....#..#.#....'
// ]

// CORRECT
//   [
//     '####.#..#.###..#..#.####.###..#..#.####.',
//     '#....#.#..#..#.#..#.#....#..#.#..#....#.',
//     '###..##...#..#.####.###..#..#.#..#...#..',
//     '#....#.#..###..#..#.#....###..#..#..#...',
//     '#....#.#..#.#..#..#.#....#....#..#.#....',
//     '####.#..#.#..#.#..#.####.#.....##..####'
//   ]