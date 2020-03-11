<template>
  <div>
    <h1 class="text-2xl mb-8">Game List</h1>
    <router-link
      :to="{ name: 'admin', params: { id: game['.key'] } }"
      v-for="game in games"
      :key="game['.key']"
    >
      <div class="max-w-sm rounded shadow-lg bg-white mb-4">
        <div class="p-4 text-xl">
          {{ game.name }}
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import { db } from "../../firebase";

export default {
  name: "GameList",
  data() {
    return {
      games: null
    };
  },
  firestore() {
    return {
      games: db.collection("Games")
    };
  }
};
</script>
