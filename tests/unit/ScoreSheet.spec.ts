import { ScoreSheet } from "@/ScoreSheet";

describe("getScore()", () => {
  it("should return 3", () => {
    const result = ScoreSheet.getScore(false, "ones", [1, 1, 2, 3, 1]);
    expect(result).toBe(3);
  });

  it("should return 50", () => {
    const result = ScoreSheet.getScore(false, "yatzy", [6, 6, 6, 6, 6]);
    expect(result).toBe(50);
  });

  it("should return 15", () => {
    const result = ScoreSheet.getScore(false, "chance", [1, 2, 3, 4, 5]);
    expect(result).toBe(15);
  });

  // should return the "fullHouse" score 25 if the yatzy field is not taken
  it("should return 25", () => {
    const result = ScoreSheet.getScore(false, "fullHouse", [1, 2, 1, 2, 1]);
    expect(result).toBe(25);
  });

  // should return the highest score of "fullHouse" if the yatzy field is already taken
  it("should return 25", () => {
    const result = ScoreSheet.getScore(true, "fullHouse", [1, 1, 1, 1, 1]);
    expect(result).toBe(25);
  });
});

describe("getNumberFieldScore()", () => {
  it("should return 3", () => {
    const result = ScoreSheet.getNumberFieldScore("ones", [1, 1, 2, 3, 1]);
    expect(result).toBe(3 * 1);
  });

  it("should return 4", () => {
    const result = ScoreSheet.getNumberFieldScore("twos", [2, 2, 3, 4, 5]);
    expect(result).toBe(2 * 2);
  });

  it("should return 0", () => {
    const result = ScoreSheet.getNumberFieldScore("fours", [1, 2, 3, 5, 6]);
    expect(result).toBe(0);
  });
});

describe("getThreeOrFourOfAKindScore()", () => {
  it("should return 18", () => {
    const result = ScoreSheet.getThreeOrFourOfAKindScore(3, [3, 3, 3, 4, 5]);
    expect(result).toBe(3 + 3 + 3 + 4 + 5);
  });

  it("should return 24", () => {
    const result = ScoreSheet.getThreeOrFourOfAKindScore(4, [3, 3, 3, 3, 5]);
    expect(result).toBe(3 + 3 + 3 + 3 + 5);
  });

  it("should return 0", () => {
    const result = ScoreSheet.getThreeOrFourOfAKindScore(3, [1, 2, 3, 4, 5]);
    expect(result).toBe(0);
  });
});

describe("getFullHouseScore()", () => {
  it("should return 25", () => {
    const result = ScoreSheet.getFullHouseScore([3, 3, 3, 4, 4]);
    expect(result).toBe(25);
  });

  it("should return 0", () => {
    const result = ScoreSheet.getFullHouseScore([1, 4, 3, 4, 5]);
    expect(result).toBe(0);
  });
});

describe("getStraightScore()", () => {
  it("should return 30", () => {
    const result = ScoreSheet.getStraightScore(4, [5, 4, 2, 5, 3]);
    expect(result).toBe(30);
  });

  it("should return 40", () => {
    const result = ScoreSheet.getStraightScore(5, [1, 5, 3, 2, 4]);
    expect(result).toBe(40);
  });

  it("should return 0", () => {
    const result = ScoreSheet.getStraightScore(4, [1, 5, 4, 3, 3]);
    expect(result).toBe(0);
  });
});

describe("getYatzyScore()", () => {
  it("should return 50", () => {
    const result = ScoreSheet.getYatzyScore([6, 6, 6, 6, 6]);
    expect(result).toBe(50);
  });

  it("should return 0", () => {
    const result = ScoreSheet.getYatzyScore([1, 2, 3, 4, 5]);
    expect(result).toBe(0);
  });
});

describe("getSumOfAllDice()", () => {
  it("should return 15", () => {
    const result = ScoreSheet.getSumOfAllDice([1, 2, 3, 4, 5]);
    expect(result).toBe(15);
  });

  it("should return 30", () => {
    const result = ScoreSheet.getSumOfAllDice([6, 6, 6, 6, 6]);
    expect(result).toBe(30);
  });
});

describe("getSumOfScores()", () => {
  it("should return 113", () => {
    const result = ScoreSheet.getSumOfScores([17, 25, 45, 12, 14]);
    expect(result).toBe(113);
  });
});

describe("getTotalScore()", () => {
  // total score without bonus
  it("should return 235", () => {
    const result = ScoreSheet.getTotalScore(
      [3, 6, 9, 12, 15, 0, 0, 24, 25, 30, 40, 18, 0],
      [3, 6, 9, 12, 15, 0]
    );
    expect(result).toBe(182);
  });

  // total score with bonus
  it("should return 235", () => {
    const result = ScoreSheet.getTotalScore(
      [3, 6, 9, 12, 15, 18, 0, 24, 25, 30, 40, 18, 0],
      [3, 6, 9, 12, 15, 18]
    );
    expect(result).toBe(200 + 35);
  });
});

describe("getRandomInt()", () => {
  it("should return a number between 1 and 6", () => {
    const result = ScoreSheet.getRandomInt(1, 6);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(6);
  });
});
