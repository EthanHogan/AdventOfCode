import { sampleInput } from "./input";

const exampleInput = `A Y
B X
C Z`;

// rock = A || X || 0
// paper = B || Y || 1
// scissors = C || Z || 2

type Score = number;
type Strategy = string;

class Move {
  name: string;
  opponentMoveAlias: string;
  myMoveAlias: string;
  winsAgainst: Move;
  losesAgainst: Move;
  moveScoreValue: Score;
}

function getPossibleMoves() {
  const RockMove = new Move();
  const PaperMove = new Move();
  const ScissorsMove = new Move();

  RockMove.name = "Rock";
  RockMove.opponentMoveAlias = "A";
  RockMove.myMoveAlias = "X";
  RockMove.winsAgainst = ScissorsMove;
  RockMove.losesAgainst = PaperMove;
  RockMove.moveScoreValue = 1;

  PaperMove.name = "Paper";
  PaperMove.opponentMoveAlias = "B";
  PaperMove.myMoveAlias = "Y";
  PaperMove.winsAgainst = RockMove;
  PaperMove.losesAgainst = ScissorsMove;
  PaperMove.moveScoreValue = 2;

  ScissorsMove.name = "Scissors";
  ScissorsMove.opponentMoveAlias = "C";
  ScissorsMove.myMoveAlias = "Z";
  ScissorsMove.winsAgainst = PaperMove;
  ScissorsMove.losesAgainst = RockMove;
  ScissorsMove.moveScoreValue = 3;

  return [RockMove, PaperMove, ScissorsMove];
}

const outcome_scores = {
  Lose: 0,
  Draw: 3,
  Win: 6,
};

function getTotalScoreForStrategy(strategy: Strategy): Score {
  let myScoreTotal: Score = 0;
  // parse the string into an array of tuples where the first value of each tuple is the opponents move and the second value is my move
  const moveAliasTuples = strategy.split("\n").map((x) => x.split(" "));
  const moves = getPossibleMoves();
  // convert array of alias tuples to array of Move tuples
  const strategy_Moves: Move[][] = moveAliasTuples.map((mat) => [
    moves.find((m) => m.opponentMoveAlias === mat[0]),
    moves.find((m) => m.myMoveAlias === mat[1]),
  ]);

  // loop through the array of tuples
  for (let sM of strategy_Moves) {
    // Add the value of the move to the total score. The value of the move I chose is the same regardless of outcome.
    const opponentMove = sM[0];
    const myMove = sM[1];
    myScoreTotal += myMove.moveScoreValue;
    // for a given tuple, determine the outocme and add the corresponding score for the outcome to myScoreTotal
    if (myMove.winsAgainst === opponentMove) {
      myScoreTotal += outcome_scores.Win;
    } else if (myMove.losesAgainst === opponentMove) {
      myScoreTotal += outcome_scores.Lose;
    } else {
      myScoreTotal += outcome_scores.Draw;
    }
  }
  return myScoreTotal;
}

console.log("Answer: ", getTotalScoreForStrategy(sampleInput));
