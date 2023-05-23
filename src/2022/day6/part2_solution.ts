import { sampleInput } from "./input";

const exampleInput = `mjqjpqmgbljsphdztnvjfqwrcgsmlb`;

function numCharsProcessedForFirstStartOfPacket(
  dataStreamBuffer: string,
  numUniqueCharsForMarker: number
): number {
  // start iterating from the 4th character (3rd index)
  for (let i = numUniqueCharsForMarker - 1; i < dataStreamBuffer.length; i++) {
    // check the current char and the previous 3 chars and see if all 3 are unique
    const uniqueChars = [];
    for (let j = 0; j < numUniqueCharsForMarker; j++) {
      const char = dataStreamBuffer[i - j];
      if (uniqueChars.includes(char)) {
        break;
      } else {
        uniqueChars.push(char);
      }
    }
    // if the length is 4, that means all 4 chars are unique. so the answer is the current index + 1;
    if (uniqueChars.length === numUniqueCharsForMarker) return i + 1;
  }
  return -1;
}

console.log(
  "Answer: ",
  numCharsProcessedForFirstStartOfPacket(sampleInput, 14)
);
