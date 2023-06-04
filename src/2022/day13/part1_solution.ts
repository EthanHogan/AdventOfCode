import { sampleInput } from "./input";

const exampleInput = `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

type Packet = any[];

class PacketPair {
    left: Packet;
    right: Packet;

    constructor(left: Packet, right: Packet) {
        this.left = left;
        this.right = right;
    }
}

const isLoggingOn = false;

function main() {
    const packetPairs: PacketPair[] = parseInputStrIntoPacketPairs(sampleInput);
    let sumOfRightOrderIndices = 0;

    for (let i = 0 ; i < packetPairs.length; i++) {
        const currentPair: PacketPair = packetPairs[i];
        const pairNumber = i + 1;

        logMessage(`== Pair ${pairNumber} ==`);

        const pairInRightOrder = isPairInRightOrder(currentPair.left, currentPair.right);

        if (pairInRightOrder) {
            sumOfRightOrderIndices += pairNumber;
        }

        logMessage();
    }

    console.log("Answer: ", sumOfRightOrderIndices);
}
main();
// Wrong answer: 1203. your answer is too low
// Wrong answer: 1240. your answer is too low
// Wrong answer: 4594. your answer is too low
// Right answer: 6240.

function parseInputStrIntoPacketPairs (input: string): PacketPair[] {
    const splitByPair = input.split("\n\n");

    return splitByPair.map((pairStr) => {
        const [leftPacketStr, rightPacketStr] = pairStr.split("\n"); // ["[1,1,3,1,1]", "[1,1,5,1,1]"]
        const leftPacket: Packet = JSON.parse(leftPacketStr);
        const rightPacket: Packet = JSON.parse(rightPacketStr);
        const packetPair: PacketPair = new PacketPair(leftPacket, rightPacket);
        return packetPair;
    })
}

function isPairInRightOrder(left: Packet, right: Packet) {
    let result = compare(left, right);
    // if the packets are identical, the compare will return undetermined.
    if (result === undefined) {
        result = true;
    }
    return result;
}

export function compare(left: number | Packet, right: number | Packet) : boolean | undefined {
    // check if both are numbers
    if (Number.isInteger(left) && Number.isInteger(right)) {
        // left is smaller, so they are in order
        if (left < right) return true;
        // right is bigger, so they are NOT in order
        if (left > right) return false;
        // they are equal, no determination can be made yet
        return;
    }

    // check if both are arrays
    if (Array.isArray(left) && Array.isArray(right)) {
        for (let i = 0; i < Math.min(left.length , right.length); i++) {
            // if (right[i] === undefined) return false;
            const result = compare(left[i], right[i]);
            if (result !== undefined) return result;
        }
        // if the left was empty or we still havent returned a result from compare in loop, 
        // then we need to compare by length
        // if left is smaller, that means left ran out first, so we will get true
        // if left is bigger, that means right ran out first, so we will get false
        return compare(left.length, right.length)
    }

    // we have mixed types. 
    // we can put both in a new array, flatten both, then run compare again. 
    // if one was orginally an array before being put into a new array, the flatten will just return the same original array.
    // if one was originally a number before being put into a array, the flatten will return the number in an array
    return compare([left].flat(), [right].flat()); 
}

function logMessage(message: string = "") {
    if (isLoggingOn) console.log(message);
}

// Note to self: this works, but just use JSON.parse() dumby....
// Not being used anymore in implementation, but left here anyway
export function parsePacketString (packetStr: string): Packet {
    let result = null;
    const currentBranch: any[][] = [];
    let numberBuilder = null;

    for(let i = 0; i < packetStr.length; i++) {
        const currentItem = packetStr[i];
        const currentList = currentBranch.at(-1);

        if (currentItem === ',') {
            if (numberBuilder !== null) {
                const number = parseInt(numberBuilder);
                currentList.push(number);
                numberBuilder = null;
            }
            continue;
        }
        if (currentItem === '[') {
            if (result === null) {
                // this is the outer most bracket, so lets start the array
                result = [];
                currentBranch.push(result);
                continue;
            }
            // this is an inner list
            const innerList: any[] = [];
            currentList.push(innerList);
            currentBranch.push(innerList);
            continue;
        }
        if (currentItem === ']') {
            if (numberBuilder !== null) {
                const number = parseInt(numberBuilder);
                currentList.push(number);
                numberBuilder = null;
            }
            // remove the last item from the currentBranch
            currentBranch.splice(currentBranch.length - 1, 1);
            continue;
        } 
        const integerStr = currentItem;
        if (numberBuilder === null) {
            numberBuilder = integerStr;
        } else {
            numberBuilder = numberBuilder.concat(integerStr);
        }
    }
    return result;
}

