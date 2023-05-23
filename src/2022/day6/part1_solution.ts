import { sampleInput } from "./input";

const exampleInput = `bvwbjplbgvbhsrlpgdmjqwftvncz`;

function numCharsProcessedForFirstStartOfPacket(
  dataStreamBuffer: string
): number {
  // start iterating from the 4th character (3rd index)
  for (let i = 3; i < dataStreamBuffer.length; i++) {
    // check the current char and the previous 3 chars and see if all 3 are unique
    const uniqueChars = [];
    for (let j = 0; j < 4; j++) {
      const char = dataStreamBuffer[i - j];
      if (uniqueChars.includes(char)) {
        break;
      } else {
        uniqueChars.push(char);
      }
    }
    // if the length is 4, that means all 4 chars are unique. so the answer is the current index + 1;
    if (uniqueChars.length === 4) return i + 1;
  }
  return -1;
}

console.log("Answer: ", numCharsProcessedForFirstStartOfPacket(sampleInput));
