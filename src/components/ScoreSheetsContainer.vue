<template>
  <!-- Score sheets -->
  <v-col
    v-for="playerAndScore in playersAndScores"
    :key="playerAndScore.name"
    class="score-sheet"
    xs="12"
    sm="12"
    md="4"
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
                playerAndScore.name !== props.currentPlayer?.name ||
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
            @click="getPlayerScore(playerAndScore)"
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
    v-model="isYatzyDialogOpen"
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
        <div class="mb-2 font-weight-bold">Woop! You got a Yatzy!</div>
        <div v-if="yatzyDialogText">{{ yatzyDialogText }}</div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ScoreSheet } from "@/ScoreSheet";
import { Player, Scores } from "@/Types.js";
import { defineEmits, defineExpose, defineProps, ref } from "vue";

const props = defineProps<{
  numberOfPlayers: number;
  currentPlayer: Player | null;
  dice: { value: number }[];
  numberOfRolls: number;
}>();

const emit = defineEmits(["swithPlayer"]);

const playersAndScores = ref<Player[]>([]);

const fieldsAsTitles: Record<keyof Scores, string> = {
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

const isYatzyDialogOpen = ref(false);
const yatzyDialogText = ref("");

const mapFieldToTitle = (field: keyof Scores): string => {
  return fieldsAsTitles[field];
};

const toCamelCase = (string: string): string => {
  return string.replace(/\s(\w)/g, (_, char: string) => char.toUpperCase());
};

const saveScore = (selectedField: string) => {
  const currentPlayerAndScore = playersAndScores.value.find(
    (playerAndScore: Player) =>
      playerAndScore.name === props.currentPlayer?.name
  );
  if (!currentPlayerAndScore) return;

  const diceValues = props.dice.map((die: { value: number }) => die.value);
  const isYatzyFieldFilled = currentPlayerAndScore.scores.yatzy !== null;

  const fieldKey = toCamelCase(selectedField) as keyof Scores;
  const score = ScoreSheet.getScore(isYatzyFieldFilled, fieldKey, diceValues);

  currentPlayerAndScore.scores[fieldKey] = score;

  emit("swithPlayer");
};

const getPlayerScore = (playerAndScore: Player) => {
  const numberFields: (keyof Scores)[] = [
    "ones",
    "twos",
    "threes",
    "fours",
    "fives",
    "sixes",
  ];

  const scoresOfNumberFields = numberFields.map(
    (field) => playerAndScore.scores[field] ?? 0
  );

  const totalOfNumberFields = ScoreSheet.getSumOfScores(scoresOfNumberFields);

  playerAndScore.bonus = totalOfNumberFields >= 63 ? 35 : 0;

  playerAndScore.total = ScoreSheet.getTotalScore(
    Object.values(playerAndScore.scores).map((s) => s ?? 0),
    scoresOfNumberFields
  );
};

const areAllFieldsFilled = (playerAndScore: Player): boolean => {
  return Object.values(playerAndScore.scores).every((score) => score !== null);
};

const generatePlayersAndScores = (numberOfPlayers: number): void => {
  const playersAndScoresArray: Player[] = [];
  for (let i = 1; i <= numberOfPlayers; i++) {
    const player: Player = {
      name: `Player ${i}`,
      turn: i === 1,
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
    };

    playersAndScoresArray.push(player);
  }

  playersAndScores.value = playersAndScoresArray;
};

const resetScoreSheets = (): void => {
  playersAndScores.value.forEach((playerAndScore: Player) => {
    for (const score in playerAndScore.scores) {
      playerAndScore.scores[score as keyof Scores] = null;
    }
    playerAndScore.bonus = 0;
    playerAndScore.total = 0;
  });
};

const showYatzyDialogIfYatzy = (): void => {
  const currentPlayerAndScore = playersAndScores.value.find(
    (playerAndScore: Player) =>
      playerAndScore.name === props.currentPlayer?.name
  );

  if (!currentPlayerAndScore) return;

  const diceValues = props.dice.map((die: { value: number }) => die.value);

  if (ScoreSheet.isYatzy(diceValues)) {
    isYatzyDialogOpen.value = true;
    setTimeout(() => {
      isYatzyDialogOpen.value = false;
    }, 2000);
  }

  if (currentPlayerAndScore.scores.yatzy !== null) {
    yatzyDialogText.value =
      "Select any field and get the maximum score of that field.";
  } else {
    yatzyDialogText.value = "";
  }
};

defineExpose({
  generatePlayersAndScores,
  resetScoreSheets,
  showYatzyDialogIfYatzy,
});
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

.score-sheet {
  min-width: 351px;
}
</style>
