<template>
  <div class="game-container">
    <div class="d-flex mb-8">
      <div
        v-for="player in players"
        :key="player.name"
      >
        <v-chip
          :key="player.name"
          class="mr-4"
          label
          :color="player.turn ? 'primary' : 'grey'"
        >
          {{ player.name }}
        </v-chip>
      </div>
    </div>

    <!-- Actions -->
    <div class="d-flex mb-8 align-center">
      <v-btn
        class="mr-4"
        @click="rollAllDice"
      >
        Roll all dice
      </v-btn>
      <v-select
        v-model="selectedScoreSavingOption"
        :items="scoreSavingOptions"
        density="comfortable"
        hide-details
      ></v-select>
    </div>

    <!-- Dice -->
    <div class="d-flex">
      <div
        v-for="(die, i) in dice"
        :key="die"
      >
        <v-btn
          class="mr-4"
          @click="rollTheDice(i)"
        >
          {{ die }}
        </v-btn>
      </div>
    </div>

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
            <div class="d-flex justify-space-between mb-2">
              <div>Ones</div>
              <div>{{ playerAndScore.scores[0].ones }}</div>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <div>Twos</div>
              <div>{{ playerAndScore.scores[0].twos }}</div>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <div>Threes</div>
              <div>{{ playerAndScore.scores[0].threes }}</div>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <div>Fours</div>
              <div>{{ playerAndScore.scores[0].fours }}</div>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <div>Fives</div>
              <div>{{ playerAndScore.scores[0].fives }}</div>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <div>Sixes</div>
              <div>{{ playerAndScore.scores[0].sixes }}</div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const players = ref([
  { name: "Player 1", turn: true },
  { name: "Player 2", turn: false },
]);

const currentPlayer = ref(players.value[0]);

const numberOfRolls = ref(0);

const dice = [ref(0), ref(0), ref(0), ref(0), ref(0), ref(0)];

const selectedScoreSavingOption = ref("Save score");

// create a table of players and their scores
const playersAndScores = ref([
  {
    name: "Player 1",
    scores: [{ ones: 0, twos: 0, threes: 0, fours: 0, fives: 0, sixes: 0 }],
  },
  {
    name: "Player 2",
    scores: [{ ones: 0, twos: 0, threes: 0, fours: 0, fives: 0, sixes: 0 }],
  },
]);

const scoreSavingOptions = [
  "Ones",
  "Twos",
  "Threes",
  "Fours",
  "Fives",
  "Sixes",
];

// when number of rolls is 3, switch to next player
const switchPlayer = () => {
  if (numberOfRolls.value === 3) {
    const nextPlayer = players.value.find(
      (player) => player.name !== currentPlayer.value.name
    );
    currentPlayer.value = nextPlayer;
    numberOfRolls.value = 0;

    // switch turn to next player
    currentPlayer.value.turn = true;
    players.value.forEach((player) => {
      if (player.name !== currentPlayer.value.name) {
        player.turn = false;
      }
    });
  }
};

const rollAllDice = () => {
  dice.forEach((die) => {
    die.value = Math.floor(Math.random() * 6) + 1;
  });
  numberOfRolls.value++;
  switchPlayer();
};

const rollTheDice = (i) => {
  dice[i].value = Math.floor(Math.random() * 6) + 1;
  numberOfRolls.value++;
  switchPlayer();
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

.score-column {
  align-items: flex-end;
}
</style>
