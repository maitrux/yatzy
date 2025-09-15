import type { Ref } from "vue";

export interface Scores {
  ones: number | null;
  twos: number | null;
  threes: number | null;
  fours: number | null;
  fives: number | null;
  sixes: number | null;
  threeOfAKind: number | null;
  fourOfAKind: number | null;
  fullHouse: number | null;
  smallStraight: number | null;
  largeStraight: number | null;
  chance: number | null;
  yatzy: number | null;
}

export interface Scores {
  ones: number | null;
  twos: number | null;
  threes: number | null;
  fours: number | null;
  fives: number | null;
  sixes: number | null;
  threeOfAKind: number | null;
  fourOfAKind: number | null;
  fullHouse: number | null;
  smallStraight: number | null;
  largeStraight: number | null;
  chance: number | null;
  yatzy: number | null;
}

export interface Player {
  name: string;
  turn: boolean;
  scores: Scores;
  bonus: number;
  total: number;
}

export type Die = Ref<number>;
