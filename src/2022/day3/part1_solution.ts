import { sampleInput } from "./input";

const example: string = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;

const smallExample: string = `vJrwpWtwJgWrhcsFMMfFFhFp`;

class Rucksack {
  compartment1: string[];
  compartment2: string[];
}

function parseRucksacks(rucksackStr: string): Rucksack[] {
  const result: Rucksack[] = [];

  const wholeRucksacks = rucksackStr.split("\n");

  for (const r of wholeRucksacks) {
    const rucksackSize = r.length;
    const rucksackHalfSize = rucksackSize / 2;

    const rucksack = new Rucksack();
    rucksack.compartment1 = r.slice(0, rucksackHalfSize).split("");
    rucksack.compartment2 = r.slice(rucksackHalfSize).split("");
    result.push(rucksack);
  }

  return result;
}

function sumOfCommonItemPriorities(rucksackStr: string) {
  let result: number = 0;

  const rucksacks: Rucksack[] = parseRucksacks(rucksackStr);
  // loop through ruck sacks
  for (const r of rucksacks) {
    // find the common item in each compartment
    let commonItem = "";
    for (const x of r.compartment1) {
      console.log("compartment1. ", x);
      if (r.compartment2.indexOf(x) !== -1) {
        commonItem = x;
        break;
      }
    }
    // get the priority for the common item
    const priority: number = priorities[commonItem];
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
