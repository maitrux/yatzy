<template>
  <div>
    <div
      v-for="die in dice"
      :key="die"
    >
      <v-btn color="red">foo</v-btn>
      <button @click="rollTheDice">
        {{ die }}
      </button>
      <v-btn color="primary">Primary Button</v-btn>
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

<style scoped></style>
