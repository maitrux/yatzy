<template>
  <div class="app-container">
    <v-row :justify-sm="players.length % 2 !== 0 ? 'space-between' : 'start'">
      <v-col
        xs="12"
        sm="12"
        md="4"
      >
        <v-card class="dice-container">
          <v-card-text
            class="d-flex flex-column justify-space-between"
            style="height: 100%"
          >
            <div>
              <div
                v-if="players.length"
                class="d-flex mb-8 justify-center align-center"
              >
                <v-icon class="mr-4">mdi-dice-multiple-outline</v-icon>
                <v-chip
                  v-show="player.turn"
                  v-for="player in players"
                  :key="player.name"
                  class="mr-4"
                  label
                  :color="player.turn ? 'primary' : 'grey'"
                >
                  <div class="font-weight-bold">{{ player.name }}</div>
                </v-chip>
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
        :numberOfPlayers="players.length"
        :currentPlayer="currentPlayer"
        :dice="dice"
        @swithPlayer="onSwitchPlayer"
      />
    </v-row>

    <v-dialog
      v-model="isAddPlayersDialogOpen"
      max-width="300px"
      :persistent="true"
    >
      <v-card>
        <v-card-text
          class="pa-4"
          style="text-align: center"
        >
          <v-text-field
            v-model="numberOfPlayers"
            label="Number of players"
            min="1"
            variant="outlined"
          />
          <v-btn
            class="mt-4"
            color="primary"
            block
            @click="addPlayers()"
          >
            Add players
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ScoreSheetsContainer from "./ScoreSheetsContainer.vue";
import { ScoreSheet } from "../ScoreSheet.ts";

const players = ref([]);

const currentPlayer = ref(players.value[0]);

const numberOfRolls = ref(0);

const dice = [ref(0), ref(0), ref(0), ref(0), ref(0)];

const selectedDice = ref([]);

const expand = ref(false);

const isAddPlayersDialogOpen = ref(false);

const numberOfPlayers = ref(1);

// ref to the DOM element of the child component
const scoreSheetContainer = ref(null);

// roll the dice when pressing enter
onMounted(() => {
  window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      rollTheDice();
    }
  });

  isAddPlayersDialogOpen.value = true;
});

const addPlayers = () => {
  // Clear existing players
  players.value = [];

  // Add new players based on numberOfPlayers
  for (let i = 0; i < numberOfPlayers.value; i++) {
    players.value.push({
      name: `Player ${i + 1}`,
      turn: i === 0, // Set first player's turn to true
    });
  }

  scoreSheetContainer.value.generatePlayersAndScores(numberOfPlayers.value);

  // Set currentPlayer to the first player
  currentPlayer.value = players.value[0];

  // Close the dialog
  isAddPlayersDialogOpen.value = false;
};

const onSwitchPlayer = () => {
  // find next player in the array
  const nextPlayer =
    players.value[
      (players.value.indexOf(currentPlayer.value) + 1) % players.value.length
    ];

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
      die.value = ScoreSheet.getRandomInt(1, 6);
    });
  } else {
    // roll only the selected dice
    selectedDice.value.forEach((i) => {
      dice[i].value = ScoreSheet.getRandomInt(1, 6);
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

  min-width: 327px;
}

.game-rules-container {
  background-color: #e4ecf7;
  color: #1867c0;
  padding: 12px;
  border-radius: 4px;
}
</style>
