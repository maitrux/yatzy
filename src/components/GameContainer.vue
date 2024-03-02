<template>
  <div class="app-container">
    <v-row>
      <v-col
        xs="12"
        sm="4"
      >
        <v-card class="dice-container">
          <v-card-text
            class="d-flex flex-column justify-space-between"
            style="height: 100%"
          >
            <div>
              <div class="d-flex mb-8 justify-center">
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
                    <div class="font-weight-bold">{{ player.name }}</div>
                  </v-chip>
                </div>
              </div>

              <!-- Actions -->
              <div class="d-flex mb-8 justify-center align-center">
                <v-btn
                  class="mr-4"
                  @click="rollTheDice"
                  flat
                  color="primary"
                  :disabled="numberOfRolls === 3"
                >
                  Roll the dice
                </v-btn>
                <v-chip color="primary">{{ numberOfRolls }}</v-chip>
              </div>

              <!-- Dice -->
              <div class="d-flex justify-center">
                <v-chip-group
                  v-model="selectedDice"
                  multiple
                  variant="outlined"
                  :disabled="numberOfRolls === 0 || numberOfRolls === 3"
                >
                  <v-chip
                    v-for="(die, i) in dice"
                    :key="i"
                    :class="i < dice.length - 1 ? 'mr-4' : ''"
                    color="primary"
                    label
                  >
                    {{ die }}
                  </v-chip>
                </v-chip-group>
              </div>

              <div class="game-rules-container mt-8">
                <div
                  class="font-weight-bold expand-rules-btn"
                  @click="expand = !expand"
                >
                  How to play?
                </div>
                <v-expand-transition>
                  <div
                    v-show="expand"
                    class="mx-auto rules-expanded"
                  >
                    <div class="mb-8 mt-8">Roll all dice</div>
                    <div>Select the field you want to insert your socre</div>
                    <div class="font-weight-bold mt-2 mb-2">OR</div>
                    <div>
                      Roll again. You can select the dice you want to roll by
                      clicking them. You can roll the dice up to 3 times during
                      your turn.
                    </div>
                  </div>
                </v-expand-transition>
              </div>
            </div>
            <v-btn
              class="mt-8"
              color="primary"
              flat
              @click="resetGame"
            >
              Play again
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Score sheets -->
      <ScoreSheetsContainer
        ref="scoreSheetContainer"
        :currentPlayer="currentPlayer"
        :dice="dice"
        :numberOfRolls="numberOfRolls"
        @swithPlayer="onSwitchPlayer"
      />
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ScoreSheetsContainer from "./ScoreSheetsContainer.vue";

const players = ref([
  { name: "Player 1", turn: true },
  { name: "Player 2", turn: false },
]);

const currentPlayer = ref(players.value[0]);

const numberOfRolls = ref(0);

const dice = [ref(0), ref(0), ref(0), ref(0), ref(0)];

const selectedDice = ref([]);

const expand = ref(false);

// ref to the DOM element of the child component
const scoreSheetContainer = ref(null);

// roll the dice when pressing enter
onMounted(() => {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      rollTheDice();
    }
  });
});

const onSwitchPlayer = () => {
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

  // reset dice and number of rolls in the end of the turn
  resetDiceAndNumOfRolls();
};

const rollTheDice = () => {
  // if first roll, roll all dice
  if (numberOfRolls.value === 0 || selectedDice.value.length === 0) {
    dice.forEach((die) => {
      die.value = Math.floor(Math.random() * 6) + 1;
    });
  } else {
    // roll only the selected dice
    selectedDice.value.forEach((i) => {
      dice[i].value = Math.floor(Math.random() * 6) + 1;
    });
  }

  // check if yatzy and show the dialog if it is
  scoreSheetContainer.value.showYatzyDialogIfYatzy();

  numberOfRolls.value++;
  selectedDice.value = [];
};

const resetGame = () => {
  // reset dice and number of rolls
  resetDiceAndNumOfRolls();

  // reset players
  players.value.forEach((player) => {
    player.turn = false;
  });

  players.value[0].turn = true;
  currentPlayer.value = players.value[0];

  // reset the score sheets
  scoreSheetContainer.value.resetScoreSheets();
};

const resetDiceAndNumOfRolls = () => {
  dice.forEach((die) => (die.value = 0));
  numberOfRolls.value = 0;
  selectedDice.value = [];
};
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 5vw;
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

::v-deep(.v-chip--disabled) {
  opacity: 1;
}

.expand-rules-btn {
  cursor: pointer;

  @media screen and (min-width: 601px) {
    cursor: default;
    pointer-events: none;
  }
}

.rules-expanded {
  max-width: 200px;

  @media screen and (max-width: 600px) {
    max-width: 250px;
  }

  @media screen and (min-width: 601px) {
    display: block !important;
  }
}

.dice-container {
  @media screen and (min-width: 601px) {
    height: 630px;
  }
}

.game-rules-container {
  background-color: #e4ecf7;
  color: #1867c0;
  padding: 12px;
  border-radius: 4px;
}
</style>
