"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input_1 = require("./input");
const exampleInput = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;
let mostTotalCalories = 0;
const top3MostTotalCalories_Ascending = [0, 0, 0];
function sumOfTop3ElvesCalories(elfCalorieData) {
    const dataSplitByElf = elfCalorieData.split("\n\n");
    for (const elfData of dataSplitByElf) {
        const currentElfCalories = elfData
            .split("\n")
            .map((s) => parseInt(s));
        const currentElfTotalCalories = sumOfArray(currentElfCalories);
        const isBiggerThanSmallestOfTop3 = currentElfTotalCalories > top3MostTotalCalories_Ascending[0];
        if (isBiggerThanSmallestOfTop3) {
            top3MostTotalCalories_Ascending[0] = currentElfTotalCalories;
            top3MostTotalCalories_Ascending.sort((a, b) => a - b);
        }
    }
    const totalOfTop3MostCalories = sumOfArray(top3MostTotalCalories_Ascending);
    console.log(totalOfTop3MostCalories);
    return totalOfTop3MostCalories;
}
function sumOfArray(arr) {
    return arr.reduce((accumulator, currentValue) => accumulator + currentValue);
}
sumOfTop3ElvesCalories(input_1.sampleInput);
// to test code run:
// `npx tsc; node ./dist/part2_solution.js`
