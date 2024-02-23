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
        flat
        color="primary"
        :disabled="numberOfRolls === 3"
      >
        Roll all dice
      </v-btn>
      <v-chip>{{ numberOfRolls }}</v-chip>
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
          variant="outlined"
          color="primary"
          :disabled="numberOfRolls === 3"
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
            <div class="d-flex align-center justify-space-between mb-2">
              <div>Ones</div>
              <v-btn
                v-if="!playerAndScore.scores.ones"
                @click="saveScore('ones')"
              >
                ADD
              </v-btn>
              <div
                v-else
                class="displayed-score d-flex align-center justify-center"
              >
                {{ playerAndScore.scores.ones }}
              </div>
            </div>
            <div class="d-flex align-center justify-space-between mb-2">
              <div>Twos</div>
              <v-btn
                v-if="!playerAndScore.scores.twos"
                @click="saveScore('twos')"
              ></v-btn>
              <div
                v-else
                class="displayed-score d-flex align-center justify-center"
              >
                {{ playerAndScore.scores.twos }}
              </div>
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

const dice = [ref(0), ref(0), ref(0), ref(0), ref(0)];

// create a table of players and their scores
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
    },
  },
]);

// when number of rolls is 3, switch to next player
const switchPlayer = () => {
  // reset dice and number of rolls
  dice.forEach((die) => (die.value = 0));
  numberOfRolls.value = 0;

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
};

const rollAllDice = () => {
  dice.forEach((die) => {
    die.value = Math.floor(Math.random() * 6) + 1;
  });
  numberOfRolls.value++;
};

const rollTheDice = (i) => {
  dice[i].value = Math.floor(Math.random() * 6) + 1;
  numberOfRolls.value++;
};

// save the score of the current player
const saveScore = (selectedOption) => {
  // count the total of all dice
  const total = dice.reduce((acc, die) => acc + die.value, 0);

  // find the player in the playersAndScores array
  const currentPlayerAndScore = playersAndScores.value.find(
    (playerAndScore) => playerAndScore.name === currentPlayer.value.name
  );

  // update the score of the current player. the selected score saving option is the key of the score object
  currentPlayerAndScore.scores[selectedOption.toLowerCase()] = total;

  // if score is saved, switch to next player
  switchPlayer();
};

// remember to clean up the watcher
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
