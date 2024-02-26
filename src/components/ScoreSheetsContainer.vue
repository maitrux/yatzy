<template>
  <!-- Score sheets -->
  <v-col
    xs="12"
    sm="4"
    v-for="playerAndScore in playersAndScores"
    :key="playerAndScore.name"
  >
    <v-card>
      <v-card-text>
        <div>
          <div class="mb-8 font-weight-bold">{{ playerAndScore.name }}</div>
          <!-- Loop through each score field -->
          <div
            v-for="(score, field) in playerAndScore.scores"
            :key="field"
            class="d-flex align-center justify-space-between score-container"
          >
            <div class="field-title">{{ mapFieldToTitle(field) }}</div>
            <v-btn
              v-if="score === null"
              flat
              density="compact"
              icon="mdi-plus"
              color="primary"
              :disabled="
                playerAndScore.name !== props.currentPlayer.name ||
                props.numberOfRolls === 0
              "
              @click="saveScore(field)"
            >
            </v-btn>
            <div
              v-else
              class="displayed-score d-flex align-center justify-center"
            >
              {{ score }}
            </div>
          </div>
        </div>

        <div v-if="allFieldsFilled(playerAndScore)">
          <v-btn
            class="mt-4"
            color="primary"
            @click="countTotal(playerAndScore)"
          >
            Count total
          </v-btn>
          <div class="mt-4">
            <div class="d-flex align-center justify-space-between">
              <div>Bonus</div>
              <div class="displayed-score d-flex align-center justify-center">
                {{ playerAndScore.bonus }}
              </div>
            </div>
            <div class="d-flex align-center justify-space-between">
              <div>Total</div>
              <div class="displayed-score d-flex align-center justify-center">
                {{ playerAndScore.total }}
              </div>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-col>

  <v-dialog
    v-model="isSecondYatzyDialogOpen"
    max-width="300px"
  >
    <v-card>
      <v-card-text
        class="pa-4"
        style="text-align: center"
      >
        <v-icon
          class="mb-2"
          color="primary"
          >mdi-party-popper</v-icon
        >
        <div class="mb-2 font-weight-bold">Woop! Yatzy!</div>
        <div>Select any field and get the maximum score of that field.</div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";

const props = defineProps({
  currentPlayer: Object,
  totalScore: Number,
  dice: Array,
  numberOfRolls: Number,
  isGameReset: Boolean,
});

const emit = defineEmits(["swithPlayer"]);

const playersAndScores = ref([
  {
    name: "Player 1",
    scores: {
      ones: null,
      twos: null,
      threes: null,
      fours: null,
      fives: null,
      sixes: null,
      threeOfAKind: null,
      fourOfAKind: null,
      fullHouse: null,
      smallStraight: null,
      largeStraight: null,
      chance: null,
      yatzy: null,
    },
    bonus: 0,
    total: 0,
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
      fullHouse: null,
      smallStraight: null,
      largeStraight: null,
      chance: null,
      yatzy: null,
    },
    bonus: 0,
    total: 0,
  },
  // {
  //   name: "Player 1",
  //   scores: {
  //     ones: 3,
  //     twos: 12,
  //     threes: 9,
  //     fours: 16,
  //     fives: 15,
  //     sixes: 18,
  //     threeOfAKind: null,
  //     fourOfAKind: null,
  //     fullHouse: null,
  //     smallStraight: null,
  //     largeStraight: null,
  //     chance: null,
  //     yatzy: null,
  //   },
  //   bonus: 0,
  //   total: 0,
  // },
]);

const mapSelectedFieldToNumber = {
  ones: 1,
  twos: 2,
  threes: 3,
  fours: 4,
  fives: 5,
  sixes: 6,
};

const fieldsAsTitles = {
  ones: "Ones (1 for each)",
  twos: "Twos (2 for each)",
  threes: "Threes (3 for each)",
  fours: "Fours (4 for each)",
  fives: "Fives (5 for each)",
  sixes: "Sixes (6 for each)",
  threeOfAKind: "Three of a kind (sum of all dice)",
  fourOfAKind: "Four of a kind (sum of all dice)",
  fullHouse: "Full house (25 points)",
  smallStraight: "Small straight (30 points)",
  largeStraight: "Large straight (40 points)",
  chance: "Chance (sum of all dice)",
  yatzy: "Yatzy (50 points)",
};

const isSecondYatzyDialogOpen = ref(false);

// watch isGameReset to reset the game
watch(
  () => props.isGameReset,
  (newValue) => {
    if (newValue && props.isGameReset === true) {
      playersAndScores.value.forEach((playerAndScore) => {
        for (const score in playerAndScore.scores) {
          playerAndScore.scores[score] = null;
        }
        playerAndScore.bonus = 0;
        playerAndScore.total = 0;
      });
    }
  }
);

// watch number of rolls to detect if the dice were thrown again
watch(
  () => props.numberOfRolls,
  (newValue) => {
    if (newValue) {
      // find playerandscore of the current player
      const currentPlayerAndScore = playersAndScores.value.find(
        (playerAndScore) => playerAndScore.name === props.currentPlayer.name
      );

      if (isYatzy() && hasAlreadyOneYatzy(currentPlayerAndScore)) {
        isSecondYatzyDialogOpen.value = true;
      }
    }
  }
);

const mapFieldToTitle = (field) => {
  return fieldsAsTitles[field];
};

// return string to camel case but with first letter not capitalized
const toCamelCase = (string) => {
  return string.replace(/\s(\w)/g, (_, char) => char.toUpperCase());
};

const saveScore = (selectedField) => {
  // find the player in the playersAndScores array
  const currentPlayerAndScore = playersAndScores.value.find(
    (playerAndScore) => playerAndScore.name === props.currentPlayer.name
  );

  let score = 0;

  // key in the score object. e.g., 'ones', 'twos', 'twoPairs, 'threeOfAKind' etc.
  const fieldKey = toCamelCase(selectedField);

  if (hasAlreadyOneYatzy(currentPlayerAndScore)) {
    // sum of the dic
    if (isYatzy()) {
      score = getSecondYatzyScore(fieldKey);
    } else {
      score = setNormalScore(fieldKey);
    }
  } else {
    // for fields 'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
    // the score is the sum of the dice that match the selected field
    score = setNormalScore(fieldKey);
  }

  // update the score of the current player. the selected score saving field is the key of the score object
  currentPlayerAndScore.scores[fieldKey] = score;

  emit("swithPlayer");
};

const setNormalScore = (fieldKey) => {
  let score = 0;

  const numberFields = ["ones", "twos", "threes", "fours", "fives", "sixes"];

  if (numberFields.includes(fieldKey)) {
    score = getNumberFieldScore(fieldKey);
  }

  if (fieldKey === "threeOfAKind") {
    score = getThreeOrFourOfAKindScore(3);
  }

  if (fieldKey === "fourOfAKind") {
    score = getThreeOrFourOfAKindScore(4);
  }

  if (fieldKey === "fullHouse") {
    score = getFullHouseScore();
  }

  if (fieldKey === "smallStraight") {
    score = getStraightScore(4);
  }

  if (fieldKey === "largeStraight") {
    score = getStraightScore(5);
  }

  if (fieldKey === "chance") {
    score = getSumOfAllDice();
  }

  if (fieldKey === "yatzy") {
    score = getYatzyScore();
  }

  return score;
};

const getNumberFieldScore = (fieldKey) => {
  let multiplier = 0;

  const selectedFieldAsNumber = mapSelectedFieldToNumber[fieldKey];

  props.dice.forEach((die) => {
    if (die.value === mapSelectedFieldToNumber[fieldKey]) {
      multiplier++;
    }
  });

  return multiplier * selectedFieldAsNumber;
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
  if (isYatzy()) {
    return 50;
  }

  // if the condition is not met, return 0
  return 0;
};

const isYatzy = () => {
  const diceValues = props.dice.map((die) => die.value);
  // const diceValues = [1, 1, 1, 1, 1];
  const largestNumberOfSameValues = getLargestNumberOfSameValues(diceValues);

  return largestNumberOfSameValues === 5;
};

const getSecondYatzyScore = (selectedField) => {
  // if the condition is not met, return 0
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
  }
};

const getSumOfAllDice = () => {
  let sum = 0;

  props.dice.forEach((die) => {
    sum += die.value;
  });

  return sum;
};

const countTotal = (playerAndScore) => {
  let total = 0;

  for (const score in playerAndScore.scores) {
    if (playerAndScore.scores[score] !== null) {
      total += playerAndScore.scores[score];
    }
  }

  // check if the total of const numberFields = ["ones", "twos", "threes", "fours", "fives", "sixes"] is greater than or equal to 63
  const numberFields = ["ones", "twos", "threes", "fours", "fives", "sixes"];
  let sumOfNumberFields = 0;
  if (numberFields.every((field) => playerAndScore.scores[field] !== null)) {
    numberFields.forEach((field) => {
      sumOfNumberFields += playerAndScore.scores[field];
    });

    if (sumOfNumberFields >= 63) {
      playerAndScore.bonus = 35;
      total += 35;
    }
  }

  playerAndScore.total = total;
};

const allFieldsFilled = (playerAndScore) => {
  for (const score in playerAndScore.scores) {
    if (playerAndScore.scores[score] === null) {
      return false;
    }
  }

  return true;
};

const hasAlreadyOneYatzy = (playerAndScore) => {
  return playerAndScore.scores.yatzy !== null;
};
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}

.displayed-score {
  text-align: center;
  height: 36px;
}

.score-container {
  height: 42px;
}

.field-title {
  width: 250px;
  text-align: left;
}
</style>
