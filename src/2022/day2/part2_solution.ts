import { sampleInput } from "./input";

const exampleInput = `A Y
B X
C Z`;

// rock = A
// paper = B
// scissors = C

// lose = 0
// draw = 1
// win = 6

type Score = number;
type Strategy = string;
type MoveOutcomeTriplet = [Move, Move, Outcome];

class Move {
  opponentMoveAlias: string;
  myMoveAlias: string;
  winsAgainst: Move;
  losesAgainst: Move;
  moveScoreValue: Score;
}

class Outcome {
  outcome: string;
  score: Score;
}

function getPossibleMoves() {
  const RockMove = new Move();
  const PaperMove = new Move();
  const ScissorsMove = new Move();

  RockMove.opponentMoveAlias = "A";
  RockMove.myMoveAlias = "X";
  RockMove.winsAgainst = ScissorsMove;
  RockMove.losesAgainst = PaperMove;
  RockMove.moveScoreValue = 1;

  PaperMove.opponentMoveAlias = "B";
  PaperMove.myMoveAlias = "Y";
  PaperMove.winsAgainst = RockMove;
  PaperMove.losesAgainst = ScissorsMove;
  PaperMove.moveScoreValue = 2;

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

const outcome_alias_score_map = {
  X: { outcome: "Lose", score: outcome_scores.Lose },
  Y: { outcome: "Draw", score: outcome_scores.Draw },
  Z: { outcome: "Win", score: outcome_scores.Win },
};

function determineMyMoveForDesiredOutcome(
  opponentMove: Move,
  desiredOutcome: Outcome
): Move {
  switch (desiredOutcome.outcome) {
    case "Draw":
      return opponentMove;
      break;
    case "Win":
      return opponentMove.losesAgainst;
      break;
    case "Lose":
      return opponentMove.winsAgainst;
      break;
  }
}

function getTotalScoreForStrategy(strategy: Strategy): Score {
  let myScoreTotal: Score = 0;
  // parse the string into an array of tuples where the first value of each tuple is the opponents move and the second value is the desired outcome
  const moveAliasTuples = strategy.split("\n").map((x) => x.split(" "));
  const moves = getPossibleMoves();
  // convert array of alias tuples to and array of [Move, Move, Outcome] triplets
  const strategy_Moves: MoveOutcomeTriplet[] = moveAliasTuples.map((mat) => {
    const opponentMove = moves.find((m) => m.opponentMoveAlias === mat[0]);
    const outcome: Outcome = outcome_alias_score_map[mat[1]];
    const myMove = determineMyMoveForDesiredOutcome(opponentMove, outcome);
    return [opponentMove, myMove, outcome] as MoveOutcomeTriplet;
  });

  // loop through the array of triplets
  for (let sM of strategy_Moves) {
    // Add to the total scor based on the value of myMove and the value of outcome's score value
    const myMove: Move = sM[1];
    const outcome: Outcome = sM[2];
    myScoreTotal += myMove.moveScoreValue;
    myScoreTotal += outcome.score;
  }
  return myScoreTotal;
}

console.log("Answer: ", getTotalScoreForStrategy(sampleInput));
