import { sampleInput } from "./input";

const example: string = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;

const smallExample: string = `vJrwpWtwJgWrhcsFMMfFFhFp`;

type Rucksack = string[];

function parseRucksacks(rucksackStr: string): Rucksack[] {
  const result: Rucksack[] = [];

  const wholeRucksacks = rucksackStr.split("\n");

  for (const r of wholeRucksacks) {
    const rucksackSize = r.length;
    const rucksackHalfSize = rucksackSize / 2;

    const rucksack: Rucksack = r.split("");
    result.push(rucksack);
  }

  return result;
}

function putElvesInGroupsOf3(rucksacks: Rucksack[]): Rucksack[][] {
  const result: Rucksack[][] = [];

  while (rucksacks.length > 0) {
    result.push(takeNext3Elves(rucksacks));
  }

  return result;

  function takeNext3Elves(remainingRucksacks: Rucksack[]) {
    return remainingRucksacks.splice(0, 3);
  }
}

function findCommonElementsBetweenLists(listOfLists: string[][]): string[] {
  const map = new Map();

  listOfLists.forEach((list) => {
    const localMap = new Map();

    list.forEach((item) => {
      // only add an occurences for items that are unique to this list.
      if (!localMap.get(item)) {
        localMap.set(item, 1);
        let occurences: number = map.get(item) ?? 0;
        map.set(item, ++occurences);
      }
    });
  });

  const commonItems: string[] = [];
  map.forEach((count: number, key: string) => {
    if (count === listOfLists.length) {
      commonItems.push(key);
    }
  });

  return commonItems;
}

function sumOfCommonItemPriorities(rucksackStr: string) {
  let result: number = 0;

  const rucksacks: Rucksack[] = parseRucksacks(rucksackStr);
  const rucksackTriplets: Rucksack[][] = putElvesInGroupsOf3(rucksacks);

  for (const rt of rucksackTriplets) {
    // find the common item in all 3 elves rucksack
    const rucksack1 = rt[0];
    const rucksack2 = rt[1];
    const rucksack3 = rt[2];

    const commonItems = findCommonElementsBetweenLists([
      rucksack1,
      rucksack2,
      rucksack3,
    ]);

    // console.log(commonItems);
    // get the priority for the common item
    const priority: number = priorities[commonItems[0]];
    result += priority;
  }

  return result;
}

const priorities = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  f: 6,
  g: 7,
  h: 8,
  i: 9,
  j: 10,
  k: 11,
  l: 12,
  m: 13,
  n: 14,
  o: 15,
  p: 16,
  q: 17,
  r: 18,
  s: 19,
  t: 20,
  u: 21,
  v: 22,
  w: 23,
  x: 24,
  y: 25,
  z: 26,
  A: 27,
  B: 28,
  C: 29,
  D: 30,
  E: 31,
  F: 32,
  G: 33,
  H: 34,
  I: 35,
  J: 36,
  K: 37,
  L: 38,
  M: 39,
  N: 40,
  O: 41,
  P: 42,
  Q: 43,
  R: 44,
  S: 45,
  T: 46,
  U: 47,
  V: 48,
  W: 49,
  X: 50,
  Y: 51,
  Z: 52,
};

console.log("Answer: ", sumOfCommonItemPriorities(sampleInput));
//2864
