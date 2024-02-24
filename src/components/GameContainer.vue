<template>
  <div class="app-container">
    <div class="d-flex">
      <v-card class="dice-container mr-8">
        <v-card-text
          class="d-flex flex-column justify-between"
          style="height: 100%"
        >
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
                {{ player.name }}
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
            <!-- @click="rollTheDice(i)" -->

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

          <v-alert
            color="primary"
            class="mt-8 flex-end"
            variant="tonal"
            max-width="236"
          >
            <div class="font-weight-bold mb-8">How to play?</div>
            <div class="mb-8">Roll all dice</div>
            <div>Select the field you want to insert your socre</div>
            <div class="font-weight-bold mt-2 mb-2">OR</div>
            <div>
              Roll again. You can select the dice you want to roll by clicking
              them. You can roll the dice up to 3 times during your turn.
            </div>
          </v-alert>
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

      <!-- Score sheets -->
      <ScoreSheetsContainer
        :currentPlayer="currentPlayer"
        :dice="dice"
        :isGameReset="isGameReset"
        @swithPlayer="onSwitchPlayer"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ScoreSheetsContainer from "./ScoreSheetsContainer.vue";

const isGameReset = ref(false);

const players = ref([
  { name: "Player 1", turn: true },
  { name: "Player 2", turn: false },
]);

const currentPlayer = ref(players.value[0]);

const numberOfRolls = ref(0);

const dice = [ref(0), ref(0), ref(0), ref(0), ref(0)];

const selectedDice = ref([]);

// when number of rolls is 3, switch to next player
const onSwitchPlayer = () => {
  // reset dice and number of rolls
  dice.forEach((die) => (die.value = 0));
  numberOfRolls.value = 0;
  selectedDice.value = [];

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

const rollTheDice = () => {
  // if first roll, roll all dice
  if (numberOfRolls.value === 0) {
    dice.forEach((die) => {
      die.value = Math.floor(Math.random() * 6) + 1;
    });
  } else {
    selectedDice.value.forEach((i) => {
      dice[i].value = Math.floor(Math.random() * 6) + 1;
    });
  }

  numberOfRolls.value++;
  selectedDice.value = [];
};

const resetGame = () => {
  // reset dice and number of rolls
  dice.forEach((die) => (die.value = 0));
  numberOfRolls.value = 0;
  selectedDice.value = [];

  // reset players
  players.value.forEach((player) => {
    player.turn = false;
  });

  players.value[0].turn = true;
  currentPlayer.value = players.value[0];

  isGameReset.value = true;

  setTimeout(() => {
    isGameReset.value = false;
  }, 50);
};
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
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
</style>
