<template>
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
          <!-- Loop through each score option -->
          <div
            v-for="(score, option) in playerAndScore.scores"
            :key="option"
            class="d-flex align-center justify-space-between mb-2"
          >
            <div>{{ option.charAt(0).toUpperCase() + option.slice(1) }}</div>
            <v-btn
              v-if="!score"
              flat
              color="primary"
              :disabled="
                playerAndScore.name !== props.currentPlayer.name ||
                totalScore === 0
              "
              @click="saveScore(option)"
            >
              ADD
            </v-btn>
            <div
              v-else
              class="displayed-score d-flex align-center justify-center"
            >
              {{ score }}
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
  currentPlayer: Object,
  totalScore: Number,
});

const emit = defineEmits(["swithPlayer"]);

const playersAndScores = ref([
  {
    name: props.currentPlayer.name,
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

const saveScore = (selectedOption) => {
  // find the player in the playersAndScores array
  const currentPlayerAndScore = playersAndScores.value.find(
    (playerAndScore) => playerAndScore.name === props.currentPlayer.name
  );

  // update the score of the current player. the selected score saving option is the key of the score object
  currentPlayerAndScore.scores[selectedOption.toLowerCase()] = props.totalScore;

  emit("swithPlayer");
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
