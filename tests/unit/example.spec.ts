import { ScoreSheet } from "@/ScoreSheet";

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
