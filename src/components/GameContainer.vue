<template>
  <div class="game-container">
    <v-btn
      class="mb-8"
      @click="rollAllDice"
    >
      Roll all dice
    </v-btn>
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
  </div>
</template>

<script setup>
import { ref } from "vue";

const dice = [ref(0), ref(0), ref(0), ref(0), ref(0), ref(0)];

const rollAllDice = () => {
  dice.forEach((die) => {
    die.value = Math.floor(Math.random() * 6) + 1;
  });
};

const rollTheDice = (i) => {
  dice[i].value = Math.floor(Math.random() * 6) + 1;
};
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}
</style>
