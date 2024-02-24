<template>
  <div class="app-container">
    <div class="d-flex">
      <v-card class="dice-container mr-8">
        <v-card-text>
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
            <v-chip>{{ numberOfRolls }}</v-chip>
          </div>

          <!-- Dice -->
          <div class="d-flex justify-center">
            <!-- @click="rollTheDice(i)" -->

            <v-chip-group
              v-model="selectedDice"
              multiple
            >
              <v-chip
                v-for="(die, i) in dice"
                :key="i"
                :class="i < dice.length - 1 ? 'mr-4' : ''"
                color="primary"
                label
                :disabled="numberOfRolls === 3"
              >
                {{ die }}
              </v-chip>
            </v-chip-group>
          </div>

          <v-alert
            v-if="numberOfRolls >= 1"
            color="primary"
            class="mt-8"
            variant="tonal"
          >
            Select the dice you want to roll again by clicking them. You can
            roll dice up to 3 times.
          </v-alert>
        </v-card-text>
      </v-card>

      <!-- Score sheets -->
      <ScoreSheetsContainer
        :currentPlayer="currentPlayer"
        :totalScore="total"
        :dice="dice"
        @swithPlayer="onSwitchPlayer"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ScoreSheetsContainer from "./ScoreSheetsContainer.vue";

const players = ref([
  { name: "Player 1", turn: true },
  { name: "Player 2", turn: false },
]);

const currentPlayer = ref(players.value[0]);

const numberOfRolls = ref(0);

const dice = [ref(0), ref(0), ref(0), ref(0), ref(0)];

const selectedDice = ref([]);

const total = ref(0);

// when number of rolls is 3, switch to next player
const onSwitchPlayer = () => {
  // reset dice and number of rolls
  dice.forEach((die) => (die.value = 0));
  numberOfRolls.value = 0;
  total.value = 0;
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
  countTotal();
  selectedDice.value = [];
};

const countTotal = () => {
  total.value = dice.reduce((acc, die) => acc + die.value, 0);
};
</script>

<style scoped>
.app-container {
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

.dice-container {
  width: 300px;
}
</style>
