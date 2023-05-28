import { sampleInput } from "./input";

const exampleInput: string = `30373
25512
65332
33549
35390`;

// if a tree is in the first or last row or column it is visible
// for other trees that are NOT on the exterior.
// if any of the below checks are true, we can move on. we dont need to know how many angles the tree is visible from, just if the tree is visible or not.
// check if the tree is taller than all other trees north of it
// check if the tree is taller than all other trees south of it
// check if the tree is taller than all other trees east of it
// check if the tree is taller than all other trees west of it
// Small optimization: for each of the above checks, we can check if the edge in that direction is the same height or taller. if it is then we know that the tree is not visible from that angle and we can move on to the next check

enum CardinalDirection {
  NORTH = "NORTH",
  SOUTH = "SOUTH",
  EAST = "EAST",
  WEST = "WEST",
}

class Tree {
  height: number;
  rowIndex: number;
  colIndex: number;

  constructor(heightOfTree, rowIndexOfTree, colIndexOfTree) {
    this.height = heightOfTree;
    this.rowIndex = rowIndexOfTree;
    this.colIndex = colIndexOfTree;
  }
}

type HeightMap = number[][];

function parseStringInputIntoHeightMap(strInput: string): HeightMap {
  const heightMap: HeightMap = [];
  // split by new line
  const rows: string[] = strInput.split("\n"); // ["30373", "25512", ...]
  // iterate over the list of rows
  rows.forEach((r: string) => {
    // split each row into trees
    const treeHeightStrings: string[] = r.split(""); // ["3", "0", "3", "7", "3"]
    // parse the strings into integers
    const treeHeights: number[] = treeHeightStrings.map(
      (treeHeight: string): number => parseInt(treeHeight)
    );
    // add to the matrix
    heightMap.push(treeHeights);
  });

  return heightMap;
}

function getHighestScenicScore(heightMapStr: string) {
  let highestScenicScore = 0;
  const heightMap: HeightMap = parseStringInputIntoHeightMap(heightMapStr);
  //   [
  //     [ 3, 0, 3, 7, 3 ],
  //     [ 2, 5, 5, 1, 2 ],
  //     [ 6, 5, 3, 3, 2 ],
  //     [ 3, 3, 5, 4, 9 ],
  //     [ 3, 5, 3, 9, 0 ]
  //   ]

  // iterate over rows and columns
  for (let r = 0; r < heightMap.length; r++) {
    const currentRow = heightMap[r];
    for (let c = 0; c < currentRow.length; c++) {
      const currentTree: Tree = new Tree(currentRow[c], r, c);

      // get the total number of visible trees in each direction
      const treesVisible_North: number = countVisibleTreesInDirection(
        currentTree,
        heightMap,
        CardinalDirection.NORTH
      );

      const treesVisible_South: number = countVisibleTreesInDirection(
        currentTree,
        heightMap,
        CardinalDirection.SOUTH
      );

      const treesVisible_East: number = countVisibleTreesInDirection(
        currentTree,
        heightMap,
        CardinalDirection.EAST
      );

      const treesVisible_West: number = countVisibleTreesInDirection(
        currentTree,
        heightMap,
        CardinalDirection.WEST
      );

      // calculate the scenic score
      const scenicScore =
        treesVisible_North *
        treesVisible_South *
        treesVisible_East *
        treesVisible_West;

      // check if we have a new high score
      if (scenicScore > highestScenicScore) {
        highestScenicScore = scenicScore;
      }
    }
  }
  return highestScenicScore;
}

function countVisibleTreesInDirection(
  tree: Tree,
  heightMap: HeightMap,
  fromDirection: CardinalDirection
): number {
  if (isTreeOnOuterEdge(tree, heightMap, fromDirection)) return 0;

  let visibleTrees = 0;

  const index_firstTreeToCheck: number = indexOfFirstTreeToCheck(
    tree,
    fromDirection
  );

  for (
    let i = index_firstTreeToCheck;
    getIteratorCondition(i, tree, fromDirection, heightMap);
    isIteratorDirectionPostive(i, fromDirection) ? i++ : i--
  ) {
    visibleTrees++;
    const currentTreeHeight = getCurrentTreeHeightInIteration(
      tree,
      i,
      fromDirection,
      heightMap
    );
    if (currentTreeHeight >= tree.height) break;
  }

  return visibleTrees;
}

function isTreeOnOuterEdge(
  tree: Tree,
  heightMap: HeightMap,
  fromDirection: CardinalDirection
): boolean {
  switch (fromDirection) {
    case CardinalDirection.NORTH:
      if (tree.rowIndex === 0) return true;
      break;
    case CardinalDirection.SOUTH:
      const index_bottomRowOfHeightMap = heightMap.length - 1;
      if (tree.rowIndex === index_bottomRowOfHeightMap) return true;
      break;
    case CardinalDirection.EAST:
      if (tree.colIndex === 0) return true;
      break;
    case CardinalDirection.WEST:
      const index_leftMostColOfHeightMap = heightMap[0].length - 1;
      if (tree.colIndex === index_leftMostColOfHeightMap) return true;
      break;
    default:
      break;
  }
  return false;
}

function indexOfFirstTreeToCheck(
  tree: Tree,
  fromDirection: CardinalDirection
): number {
  switch (fromDirection) {
    case CardinalDirection.NORTH:
      return tree.rowIndex - 1;
    case CardinalDirection.SOUTH:
      return tree.rowIndex + 1;
    case CardinalDirection.EAST:
      return tree.colIndex - 1;
    case CardinalDirection.WEST:
      return tree.colIndex + 1;
    default:
      return null;
  }
}

function getIteratorCondition(
  index: number,
  tree: Tree,
  fromDirection: CardinalDirection,
  heightMap: HeightMap
): boolean {
  switch (fromDirection) {
    case CardinalDirection.NORTH:
      return index >= 0;
    case CardinalDirection.EAST:
      return index >= 0;
    case CardinalDirection.SOUTH:
      return index < heightMap.length;
    case CardinalDirection.WEST:
      return index < heightMap[tree.rowIndex].length;
    default:
      return null;
  }
}

function isIteratorDirectionPostive(
  index: number,
  fromDirection: CardinalDirection
): boolean {
  switch (fromDirection) {
    case CardinalDirection.NORTH:
      return false;
    case CardinalDirection.EAST:
      return false;
    case CardinalDirection.SOUTH:
      return true;
    case CardinalDirection.WEST:
      return true;
    default:
      return null;
  }
}

function getCurrentTreeHeightInIteration(
  tree: Tree,
  currentIndex: number,
  fromDirection: CardinalDirection,
  heightMap: HeightMap
): number {
  switch (fromDirection) {
    case CardinalDirection.NORTH:
      return heightMap[currentIndex][tree.colIndex];
    case CardinalDirection.SOUTH:
      return heightMap[currentIndex][tree.colIndex];
    case CardinalDirection.EAST:
      return heightMap[tree.rowIndex][currentIndex];
    case CardinalDirection.WEST:
      return heightMap[tree.rowIndex][currentIndex];
    default:
      return null;
  }
}

console.log("Answer: ", getHighestScenicScore(sampleInput));
