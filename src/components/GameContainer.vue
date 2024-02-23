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
    <ScoreCardsContainer
      :currentPlayer="currentPlayer"
      :totalScore="total"
      @swithPlayer="onSwitchPlayer"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import ScoreCardsContainer from "./ScoreCardsContainer.vue";

const players = ref([
  { name: "Player 1", turn: true },
  { name: "Player 2", turn: false },
]);

const currentPlayer = ref(players.value[0]);

const numberOfRolls = ref(0);

const dice = [ref(0), ref(0), ref(0), ref(0), ref(0)];

const total = ref(0);

// when number of rolls is 3, switch to next player
const onSwitchPlayer = () => {
  // reset dice and number of rolls
  dice.forEach((die) => (die.value = 0));
  numberOfRolls.value = 0;
  total.value = 0;

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
  countTotal();
};

const rollTheDice = (i) => {
  dice[i].value = Math.floor(Math.random() * 6) + 1;
  numberOfRolls.value++;
  countTotal();
};

const countTotal = () => {
  total.value = dice.reduce((acc, die) => acc + die.value, 0);
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
