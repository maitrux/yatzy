<template>
  <!-- Score sheets -->
  <div class="d-flex mt-8">
    <v-card
      v-for="playerAndScore in playersAndScores"
      :key="playerAndScore.name"
      class="mr-4"
      width="200"
    >
      <v-card-text>
        <div>
          <div class="mb-8">{{ playerAndScore.name }}</div>
          <!-- Loop through each score option -->
          <div
            v-for="(score, option) in playerAndScore.scores"
            :key="option"
            class="d-flex align-center justify-space-between mb-2"
          >
            <div>{{ option.charAt(0).toUpperCase() + option.slice(1) }}</div>
            <v-btn
              v-if="score === null"
              flat
              color="primary"
              :disabled="
                playerAndScore.name !== props.currentPlayer.name ||
                totalScore === 0
              "
              @click="saveScore(option)"
            >
              ADD
            </v-btn>
            <div
              v-else
              class="displayed-score d-flex align-center justify-center"
            >
              {{ score }}
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
  currentPlayer: Object,
  totalScore: Number,
  dice: Array,
});

const emit = defineEmits(["swithPlayer"]);

const playersAndScores = ref([
  {
    name: props.currentPlayer.name,
    scores: {
      ones: null,
      twos: null,
      threes: null,
      fours: null,
      fives: null,
      sixes: null,
      threeOfAKind: null,
      fourOfAKind: null,
      smallStraight: null,
      largeStraight: null,
      fullHouse: null,
      chance: null,
      yatzy: null,
    },
  },
  {
    name: "Player 2",
    scores: {
      ones: null,
      twos: null,
      threes: null,
      fours: null,
      fives: null,
      sixes: null,
      threeOfAKind: null,
      fourOfAKind: null,
      smallStraight: null,
      largeStraight: null,
      fullHouse: null,
      chance: null,
      yatzy: null,
    },
  },
]);

const mapSelectedOptionToNumber = {
  ones: 1,
  twos: 2,
  threes: 3,
  fours: 4,
  fives: 5,
  sixes: 6,
};

// return string to camel case but with first letter not capitalized
const toCamelCase = (string) => {
  return string.replace(/\s(\w)/g, (_, char) => char.toUpperCase());
};

const saveScore = (selectedOption) => {
  // find the player in the playersAndScores array
  const currentPlayerAndScore = playersAndScores.value.find(
    (playerAndScore) => playerAndScore.name === props.currentPlayer.name
  );

  let score = 0;

  // key in the score object. e.g., 'ones', 'twos', 'twoPairs, 'threeOfAKind' etc.
  const optionKey = toCamelCase(selectedOption);

  // for 'ones', 'twos', 'threes', 'fours', 'fives', 'sixes' options,
  // the score is the sum of the dice that match the selected option
  const numberOptions = ["ones", "twos", "threes", "fours", "fives", "sixes"];

  if (numberOptions.includes(optionKey)) {
    score = getNumberOptionScore(optionKey);
  }

  if (optionKey === "threeOfAKind") {
    score = getThreeOrFourOfAKindScore(3);
  }

  if (optionKey === "fourOfAKind") {
    score = getThreeOrFourOfAKindScore(4);
  }

  if (optionKey === "fullHouse") {
    score = getFullHouseScore();
  }

  if (optionKey === "smallStraight") {
    score = getStraightScore(4);
  }

  if (optionKey === "largeStraight") {
    score = getStraightScore(5);
  }

  if (optionKey === "chance") {
    score = getSumOfAllDice();
  }

  if (optionKey === "yatzy") {
    score = getYatzyScore();
  }

  console.log(score);

  // update the score of the current player. the selected score saving option is the key of the score object
  currentPlayerAndScore.scores[optionKey] = score;

  emit("swithPlayer");
};

const getNumberOptionScore = (optionKey) => {
  let multiplier = 0;

  const selectedOptionAsNumber = mapSelectedOptionToNumber[optionKey];

  props.dice.forEach((die) => {
    if (die.value === mapSelectedOptionToNumber[optionKey]) {
      multiplier++;
    }
  });

  return multiplier * selectedOptionAsNumber;
};

const getThreeOrFourOfAKindScore = (numberOfDiceThatNeedToMatch) => {
  const diceValues = props.dice.map((die) => die.value);
  const largestNumberOfSameValues = getLargestNumberOfSameValues(diceValues);

  // check if the condition of 'three of a kind' or 'four of a kind' is met
  // if not, return 0
  if (largestNumberOfSameValues < numberOfDiceThatNeedToMatch) {
    return 0;
  }

  // if the condition is met, return the sum of all dice
  return getSumOfAllDice();
};

const getLargestNumberOfSameValues = (arr) => {
  const count = {};
  let maxCount = 0;

  arr.forEach((num) => {
    count[num] = (count[num] || 0) + 1;
    maxCount = Math.max(maxCount, count[num]);
  });

  return maxCount;
};

const getFullHouseScore = () => {
  const diceValues = props.dice.map((die) => die.value);
  const count = {};

  diceValues.forEach((num) => {
    count[num] = (count[num] || 0) + 1;
  });

  const values = Object.values(count);

  console.log(values);

  // if the condition is met, return 25
  if (values.includes(3) && values.includes(2)) {
    return 25;
  }

  // if the condition is not met, return 0
  return 0;
};

const getStraightScore = (lengthOfStraight) => {
  const diceValues = props.dice.map((die) => die.value);
  const sortedDice = diceValues.sort((a, b) => a - b);

  // small straight: [1, 2, 3, 4] or [2, 3, 4, 5] or [3, 4, 5, 6]
  // large straight: [1, 2, 3, 4, 5] or [2, 3, 4, 5, 6]

  let numberOfConsecutiveNumbers = 1;

  sortedDice.forEach((die, i) => {
    if (die === sortedDice[i + 1] - 1) {
      numberOfConsecutiveNumbers++;
    }
  });

  // Return the corresponding score
  if (numberOfConsecutiveNumbers >= lengthOfStraight) {
    return lengthOfStraight === 4 ? 30 : 40; // Large or small straight score
  } else {
    return 0; // Not a valid straight
  }
};

const getYatzyScore = () => {
  const diceValues = props.dice.map((die) => die.value);
  const largestNumberOfSameValues = getLargestNumberOfSameValues(diceValues);

  // if the condition is met, return 50
  if (largestNumberOfSameValues === 5) {
    return 50;
  }

  // if the condition is not met, return 0
  return 0;
};

const getSumOfAllDice = () => {
  let sum = 0;

  props.dice.forEach((die) => {
    sum += die.value;
  });

  return sum;
};
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}

.column {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 50%; /* Set both columns to occupy equal width */
}

.column div {
  margin-bottom: 8px;
}

.displayed-score {
  text-align: center;
  height: 36px;
}
</style>
