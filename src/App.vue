<template>
  <v-app>
    <v-main>
      <GameContainer />
    </v-main>
  </v-app>
</template>

<script>
import GameContainer from "./components/GameContainer.vue";

export default {
  name: "App",

  components: {
    GameContainer,
  },

  data: () => ({
    //
  }),
};
</script>
