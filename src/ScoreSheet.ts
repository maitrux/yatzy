export class ScoreSheet {
  static getScore(fieldKey: string, diceValues: number[]): number {
    let score = 0;

    const numberFields = ["ones", "twos", "threes", "fours", "fives", "sixes"];

    if (numberFields.includes(fieldKey)) {
      score = this.getNumberFieldScore(fieldKey, diceValues);
    }

    if (fieldKey === "threeOfAKind") {
      score = this.getThreeOrFourOfAKindScore(3, diceValues);
    }

    if (fieldKey === "fourOfAKind") {
      score = this.getThreeOrFourOfAKindScore(4, diceValues);
    }

    if (fieldKey === "fullHouse") {
      score = this.getFullHouseScore(diceValues);
    }

    if (fieldKey === "smallStraight") {
      score = this.getStraightScore(4, diceValues);
    }

    if (fieldKey === "largeStraight") {
      score = this.getStraightScore(5, diceValues);
    }

    if (fieldKey === "chance") {
      score = this.getSumOfAllDice(diceValues);
    }

    if (fieldKey === "yatzy") {
      score = this.getYatzyScore(diceValues);
    }

    return score;
  }

  /**
   * Get the score of a number field (e.g. 'ones', 'twos', 'threes' etc.)
   * @param fieldKey e.g. 'ones', 'twos' etc.
   * @param diceValues e.g. [1, 2, 3, 4, 5]
   * @retun sum of all dice that match the selected field (e.g. [1, 1, 2, 3, 1] => 3 * 1 = 3)
   */
  static getNumberFieldScore(fieldKey: string, diceValues: number[]): number {
    let multiplier = 0;

    const selectedFieldAsNumber = this.mapSelectedFieldToNumber(fieldKey);

    diceValues.forEach((value) => {
      if (value === this.mapSelectedFieldToNumber(fieldKey)) {
        multiplier++;
      }
    });

    return multiplier * selectedFieldAsNumber;
  }

  /** Get the score for three or four of a kind
   * @param numberOfDiceThatNeedToMatch 3 for three of a kind, 4 for four of a kind
   * @param diceValues e.g. [1, 2, 3, 4, 5]
   * @retun sum of all dice if the condition is met, 0 if not
   */
  static getThreeOrFourOfAKindScore(
    numberOfDiceThatNeedToMatch: number,
    diceValues: number[]
  ): number {
    const largestNumberOfSameValues =
      this.getLargestNumberOfSameValues(diceValues);

    // if there are not enough dice that match the number of dice that need to match, return 0
    if (largestNumberOfSameValues < numberOfDiceThatNeedToMatch) {
      return 0;
    }

    // if the condition is met, return the sum of all dice
    return this.getSumOfAllDice(diceValues);
  }

  /**
   * Get the score for a full house
   * @param diceValues e.g. [1, 2, 3, 4, 5]
   * @return 25 if there is two dice with the same value and three dice with the same value [e.g. 2, 2, 5, 5, 5], 0 if not
   */
  static getFullHouseScore(diceValues: number[]): number {
    const count: { [key: number]: number } = {};

    diceValues.forEach((num) => {
      count[num] = (count[num] || 0) + 1;
    });

    const values = Object.values(count);

    // if the condition is met, return 25
    if (values.includes(3) && values.includes(2)) {
      return 25;
    }

    // if the condition is not met, return 0
    return 0;
  }

  /**
   * Get the score for a small or large straight
   * @param lengthOfStraight 4 for small straight, 5 for large straight
   * @param diceValues e.g. [1, 2, 3, 4, 5]
   * @return 30 for small straight, 40 for large straight, 0 if no straight
   */
  static getStraightScore(
    lengthOfStraight: number,
    diceValues: number[]
  ): number {
    // small straight: [1, 2, 3, 4] or [2, 3, 4, 5] or [3, 4, 5, 6]
    // large straight: [1, 2, 3, 4, 5] or [2, 3, 4, 5, 6]

    // sort the dice values ascending
    const sortedDiceValues = diceValues.sort((a, b) => a - b);
    let numberOfConsecutiveNumbers = 1;

    sortedDiceValues.forEach((die, i) => {
      if (die === sortedDiceValues[i + 1] - 1) {
        numberOfConsecutiveNumbers++;
      }
    });

    // Return the corresponding score
    if (numberOfConsecutiveNumbers >= lengthOfStraight) {
      return lengthOfStraight === 4 ? 30 : 40; // Large or small straight score
    } else {
      return 0; // Not a valid straight
    }
  }

  /** Get the sum of all dice
   * @param diceValues e.g. [1, 2, 3, 4, 5]
   * @return sum of all dice
   */
  static getSumOfAllDice(diceValues: number[]): number {
    let sum = 0;

    diceValues.forEach((value) => {
      sum += value;
    });

    return sum;
  }

  /** Get the score for a yatzy
   * @param diceValues e.g. [1, 2, 3, 4, 5]
   * @return 50 if all dice have the same value, 0 if not
   */
  static getYatzyScore(diceValues: number[]): number {
    if (this.isYatzy(diceValues)) {
      return 50;
    }

    // if the condition is not met, return 0
    return 0;
  }

  /** Get the highest possible score of a field
   * @param selectedField e.g. 'ones', 'threeOfAKind', 'fullHouse' etc.
   * @return the highest possible score of the selected field
   */
  static getHighestPossibleScoreOfField(selectedField: string): number {
    switch (selectedField) {
      case "ones":
        return 5;
      case "twos":
        return 10;
      case "threes":
        return 15;
      case "fours":
        return 20;
      case "fives":
        return 25;
      case "sixes":
        return 30;
      case "threeOfAKind":
        return 30;
      case "fourOfAKind":
        return 30;
      case "fullHouse":
        return 25;
      case "smallStraight":
        return 30;
      case "largeStraight":
        return 40;
      case "chance":
        return 30;
      default:
        return 0;
    }
  }

  // HELPER FUNCTONS

  /** Check if is a yatzy
   * @param diceValues e.g. [1, 2, 3, 4, 5]
   * @return true if all dice have the same value, false if not
   */
  static isYatzy(diceValues: number[]): boolean {
    return this.getLargestNumberOfSameValues(diceValues) === 5;
  }

  /** Get the corresponding number of a number fieldkey
   * @param fieldKey e.g. 'ones', 'twos' etc.
   * @return the corresponding number of the selected field
   */
  static mapSelectedFieldToNumber(fieldKey: string): number {
    const fieldKeyToNumberMap: { [key: string]: number } = {
      ones: 1,
      twos: 2,
      threes: 3,
      fours: 4,
      fives: 5,
      sixes: 6,
    };

    return fieldKeyToNumberMap[fieldKey];
  }

  /** Get the largest number of same values
   * @param numbers e.g. [1, 2, 3, 4, 5]
   * @return the largest number of same values
   */
  static getLargestNumberOfSameValues(numbers: number[]) {
    const count: { [key: number]: number } = {}; // Add index signature to count object
    let maxCount = 0;

    numbers.forEach((num) => {
      count[num] = (count[num] || 0) + 1;
      maxCount = Math.max(maxCount, count[num]);
    });

    return maxCount;
  }
}
