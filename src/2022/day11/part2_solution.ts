import { sampleInput, exampleInput } from "./input";

const smallInput = `Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 0`;

//Example Input
// Monkey 0:
//   Starting items: 79, 98
//   Operation: new = old * 19
//   Test: divisible by 23
//     If true: throw to monkey 2
//     If false: throw to monkey 3

// Monkey 1:
//   Starting items: 54, 65, 75, 74
//   Operation: new = old + 6
//   Test: divisible by 19
//     If true: throw to monkey 2
//     If false: throw to monkey 0

// Monkey 2:
//   Starting items: 79, 60, 97
//   Operation: new = old * old
//   Test: divisible by 13
//     If true: throw to monkey 1
//     If false: throw to monkey 3

// Monkey 3:
//   Starting items: 74
//   Operation: new = old + 3
//   Test: divisible by 17
//     If true: throw to monkey 0
//     If false: throw to monkey 1

class Item {
    worryLevel: number;

    constructor(itemWorryLevel: number) {
        this.worryLevel = itemWorryLevel;
    }
}

const Operate = {
    "*": function (factor1: number, factor2: number): number {
        return factor1 * factor2;
    },
    "+": function (term1: number, term2: number): number {
        return term1 + term2;
    },
    "/": function(numerator: number, denominator: number): number {
        return Math.floor(numerator / denominator);
    },
    "%": function(numerator: number, denominator: number): number {
        return numerator % denominator;
    },
    "-": function(term1: number, term2: number) : number {
        return term1 - term2;
    }
}

const OperationVerbs = {
    "*": "multiplied",
    "+": "increases",
    "-": "decreases",
    "/": "divided"
}

type Operator = "*" | "+" | "-" | "/" | "%";

class Operation {
    operator: Operator; // *, +, -, /
    value: number;
    isValOldVal: boolean = false;

    constructor(operatorSymbol: Operator, valueToDoOperationWith: number = null, isValueTheOldValueOfTheItem: boolean = false) {
        this.operator = operatorSymbol;
        this.value = valueToDoOperationWith;
        this.isValOldVal = isValueTheOldValueOfTheItem;
    }
}

class Monkey {
    items: Item[] = [];
    operation: Operation;
    testDenominator: number;
    truthyMonkey: Monkey;
    falsyMonkey: Monkey;
    inspections: number = 0;

    test(numerator: number) {
        return numerator % this.testDenominator === 0;
    }
}

class ThrowItem {
    item: Item;
    fromMonkey: Monkey;
    toMonkey: Monkey;

    constructor(itemToThrow: Item, monkeyToThrowFrom: Monkey, monkeyToThrowTo: Monkey) {
        this.item = itemToThrow;
        this.fromMonkey = monkeyToThrowFrom;
        this.toMonkey = monkeyToThrowTo;
    }

    execute() {
        const self = this;
        // find the index of the item to throw on the fromMonkeys items;
        const indexOfItemToThrow = self.fromMonkey.items.findIndex((x) => x.worryLevel === self.item.worryLevel);
        // remove the item from the fromMonkey
        const itemToThrow = self.fromMonkey.items.splice(indexOfItemToThrow, 1)[0];
        // add the removed item to the toMonkey's items
        self.toMonkey.items.push(itemToThrow);
    }
}

console.log("Answer: ", findMonkeyBusinessAfterNRounds(sampleInput, 10000, false));

function findMonkeyBusinessAfterNRounds(inputNotes: string, nRounds: number, loggingOn: boolean): number {
    const monkeys = parseInputNotesIntoMonkeys(inputNotes);

    // find the modulo value that is divisible by every testDenominator
    const superModulo = monkeys.reduce((acc, cv) => {
        if (acc === 0) return cv.testDenominator;
        return acc * cv.testDenominator
    }, 0);

    let roundsRun = 0;
    const roundCheckpoints = [1, 20, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];
    for (let r = 0; r < nRounds; r++) {
        roundsRun++;
        if (loggingOn && roundCheckpoints.includes(roundsRun - 1)) {
            logMessage(`==After round ${roundsRun - 1}==`, loggingOn);
            for (let i = 0; i < monkeys.length; i++) {
                logMessage(`Monkey ${i} inspected items ${monkeys[i].inspections} times.`, loggingOn);
            }
            logMessage("", loggingOn);
        }
        logMessage(`Begin Round: ${r}`, loggingOn);
        logMessage("", loggingOn); // add empty line
        for (let i = 0; i < monkeys.length; i++) {
            const monkey = monkeys[i];
            logMessage(`Monkey ${i}:`, loggingOn);
            // monkey inspects each item one at time
            const itemsToThrow: ThrowItem[] = [];
            for(let item of monkey.items) {
                // increment the monkey's inspections
                monkey.inspections++;
                logMessage(`Monkey inspects an item with a worry level of ${item.worryLevel}.`, loggingOn);

                // get the worryLevelAfterOperation
                let valueOfOperation = monkey.operation.isValOldVal ? item.worryLevel : monkey.operation.value;
                item.worryLevel = getResultOfOperationOnWorryLevel(item.worryLevel, monkey.operation);
                logMessage(` Worry level is ${OperationVerbs[monkey.operation.operator]} by ${valueOfOperation} to ${item.worryLevel}.`, loggingOn);

                // maintain the worryLevels
                const maintainedWorryLevel = item.worryLevel % superModulo;
                logMessage(` Maintaining worry level. Decreasing from ${item.worryLevel} to ${maintainedWorryLevel}`, loggingOn);
                item.worryLevel = maintainedWorryLevel;

                // test the worry level using the monkey's test method
                // DO NOT move the item in this loop because we are dont want to manipulate the list we are iterating over. 
                // Instead, store the item and the monkey it needs to move to in a list outside of this loo.
                if (monkey.test(item.worryLevel)) {
                    logMessage(` Current worry level is divisible by ${monkey.testDenominator}.`, loggingOn);
                    // if the test passes, throw the item to the truthyMonkey
                    const throwItem = new ThrowItem(item, monkey, monkey.truthyMonkey);
                    const indexOfMonkeyThrowingTo = monkeys.find((x) => x === throwItem.toMonkey);
                    logMessage(` Item with worry level ${throwItem.item.worryLevel} is thrown to monkey ${indexOfMonkeyThrowingTo}.`, loggingOn);
                    itemsToThrow.push(throwItem);
                } else {
                    logMessage(` Current worry level is not divisible by ${monkey.testDenominator}.`, loggingOn);
                    // if the test fails, throw the item to the falsyMonkey
                    const throwItem = new ThrowItem(item, monkey, monkey.falsyMonkey);
                    const indexOfMonkeyThrowingTo = monkeys.findIndex((x) => x === throwItem.toMonkey);
                    logMessage(` Item with worry level ${throwItem.item.worryLevel} is thrown to monkey ${indexOfMonkeyThrowingTo}.`, loggingOn);
                    itemsToThrow.push(throwItem);
                }
            }
            
            // move the items from the currentMonkey to the next monkey
            for (let throwItem of itemsToThrow) {
                throwItem.execute();
            }
            
            logMessage("", loggingOn);// add empty line
        }
    }

    logMessage(`Rounds completed: ${roundsRun}`, loggingOn);

    const mostActiveMonkeys = findMostActiveMonkeys(monkeys, 2);
    const monkeyBusiness = mostActiveMonkeys.reduce((acc, cv) => {
        if (acc === 0) {
            return acc + cv.inspections;
        }
        return acc * cv.inspections
    }, 0);

    return monkeyBusiness;
}

function parseInputNotesIntoMonkeys(inputNotes: string): Monkey[] {
    const result: Monkey[] = [];
    const monkeyStrSplitByMonkey: string[] = inputNotes.split("\n\n");

    // go ahead and create a bunch of monkeys with default data
    for (const ms of monkeyStrSplitByMonkey) {
        result.push(new Monkey());
    }

    for (let i = 0; i < monkeyStrSplitByMonkey.length; i++) {
        const monkeyLines = monkeyStrSplitByMonkey[i].split("\n");
        
        const startingItemStrs: string[] = monkeyLines[1].replace("Starting items: ", "").split(", ");
        const startingItems = startingItemStrs.map((sis) => parseInt(sis));

        const operationTuple = monkeyLines[2].replace("Operation: new = old ", "").split(" ");
        const operationOperator: Operator = operationTuple[0] as Operator;
        const operationValue = parseInt(operationTuple[1]);
        const shouldUseOldValueForOperation = isNaN(operationValue);

        let operation: Operation = null;
        if (shouldUseOldValueForOperation) {
            operation = new Operation(operationOperator, null, shouldUseOldValueForOperation);
        } else {
            operation = new Operation(operationOperator, operationValue, shouldUseOldValueForOperation);
        }

        const testDenominator = parseInt(monkeyLines[3].replace("Test: divisible by ", ""));

        const indexOfTruthyMonkey = parseInt(monkeyLines[4].replace("If true: throw to monkey", "").trim());
        const indexOfFalsyMoney = parseInt(monkeyLines[5].replace("If false: throw to monkey", "").trim());

        // set overwrite the properties of the monkey in the result at the same index.
        const monkey = result[i];
        monkey.items = startingItems.map((worryLevel) => new Item(worryLevel));
        monkey.operation = operation;
        monkey.testDenominator = testDenominator;
        monkey.truthyMonkey = result[indexOfTruthyMonkey];
        monkey.falsyMonkey = result[indexOfFalsyMoney];
    }
    return result;
}

function findMostActiveMonkeys(monkeys: Monkey[], nMostActive: number) {
    // keep this ordered from least inspections to greatest
    const mostActiveMonkeys: Monkey[] = [];

    for (const monkey of monkeys) {
        if (mostActiveMonkeys.length < nMostActive) {
            mostActiveMonkeys.push(monkey);
            mostActiveMonkeys.sort((a, b) => a.inspections - b.inspections);
            continue;
        }

        if (mostActiveMonkeys[0].inspections < monkey.inspections) {
            mostActiveMonkeys[0] = monkey;
            mostActiveMonkeys.sort((a, b) => a.inspections - b.inspections);
        }
    }

    return mostActiveMonkeys;
}

function getResultOfOperationOnWorryLevel(worryLevel: number, operation: Operation): number {
    let valToDoOperationWith = null;
    if (operation.isValOldVal) {
        valToDoOperationWith = worryLevel;
    } else {
        valToDoOperationWith = operation.value;
    }
    return Operate[operation.operator](worryLevel, valToDoOperationWith);
}

function logMessage(message: string, loggingOn: boolean) {
    if (loggingOn) {
        console.log(message);
    }
}