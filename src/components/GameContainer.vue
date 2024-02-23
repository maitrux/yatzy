<template>
  <div class="game-container">
    <v-btn class="mb-4">Roll all dice</v-btn>
    <div class="d-flex">
      <div
        v-for="die in dice"
        :key="die"
      >
        <v-btn
          class="mr-4"
          @click="rollTheDice"
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

const rollTheDice = () => {
  dice.forEach((die) => {
    die.value = Math.floor(Math.random() * 6) + 1;
  });
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
