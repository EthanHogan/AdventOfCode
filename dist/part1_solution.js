"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
function parseElfCalorieData(elfCalorieData) {
    // console.log("initial input: ", elfCalorieData);
    const dataSplitByElf = elfCalorieData.split("\n\n");
    for (const elfData of dataSplitByElf) {
        let currentElfCalories = elfData.split("\n").map((s) => parseInt(s));
        const currentElfTotalCalories = currentElfCalories.reduce((acc, cv) => acc + cv);
        if (currentElfTotalCalories > mostTotalCalories) {
            mostTotalCalories = currentElfTotalCalories;
        }
    }
    console.log(mostTotalCalories);
    return mostTotalCalories;
}
parseElfCalorieData(exampleInput);
