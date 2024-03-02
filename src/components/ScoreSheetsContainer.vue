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

        <div v-if="areAllFieldsFilled(playerAndScore)">
          <v-btn
            class="mt-4"
            color="primary"
            @click="getTotalScore(playerAndScore)"
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
import { ScoreSheet } from "../ScoreSheet.ts";

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
  //   name: "Player 2",
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

      const diceValues = props.dice.map((die) => die.value);

      if (
        ScoreSheet.isYatzy(diceValues) &&
        currentPlayerAndScore.scores.yatzy !== null
      ) {
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

  const diceValues = props.dice.map((die) => die.value);

  const isYatzyFieldFilled = currentPlayerAndScore.scores.yatzy !== null;

  score = ScoreSheet.getScore(isYatzyFieldFilled, fieldKey, diceValues);

  // update the score of the current player. the selected score saving field is the key of the score object
  currentPlayerAndScore.scores[fieldKey] = score;

  emit("swithPlayer");
};

const getTotalScore = (playerAndScore) => {
  const totalOfAllFields = ScoreSheet.getSumOfScores(playerAndScore.scores);

  const numberFields = ["ones", "twos", "threes", "fours", "fives", "sixes"];

  // map all the number field values to an array of numbers
  const numberFieldValues = numberFields.map(
    (field) => playerAndScore.scores[field]
  );

  const totalOfNumberFields = ScoreSheet.getSumOfScores(numberFieldValues);

  playerAndScore.bonus = totalOfNumberFields >= 63 ? 35 : 0;
  playerAndScore.total = ScoreSheet.getTotalScore(
    totalOfAllFields,
    totalOfNumberFields
  );
};

const areAllFieldsFilled = (playerAndScore) => {
  for (const score in playerAndScore.scores) {
    if (playerAndScore.scores[score] === null) {
      return false;
    }
  }

  return true;
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
