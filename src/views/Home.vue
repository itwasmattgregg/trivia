<template>
  <div class="p-8">
    <h1 class="text-2xl mb-4">Welcome to Nerdy Autocomplete!</h1>
    <form @submit.prevent="login">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="hash">
        Login here
      </label>
      <input
        type="text"
        id="hash"
        v-model="teamHash"
        placeholder="Enter your secret team ID"
        class="shadow appearance-none border rounded w-full py-2 px-3 mb-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      <p class="text-red text-xs italic mb-2" v-if="errorMessage.length">
        {{ errorMessage }}
      </p>
      <button
        :class="
          `bg-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
            ${disabled && 'opacity-50'}`
        "
        type="submit"
        :disabled="disabled"
      >
        Login
      </button>
    </form>
  </div>
</template>

<script>
import { db } from "../firebase";

export default {
  name: "home",
  data() {
    return {
      teamHash: "",
      attempts: 0,
      errorMessage: ""
    };
  },
  computed: {
    disabled() {
      if (this.attempts > 5 || this.teamHash.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    login() {
      if (this.attempts > 5) {
        return;
      }

      this.attempts = this.attempts + 1;

      const teams = db
        .collectionGroup("Teams")
        .where("hash", "==", this.teamHash);

      teams.get().then(querySnapshot => {
        if (querySnapshot.empty) {
          this.errorMessage = "That's not a valid team ID...";

          if (this.attempts > 5) {
            this.errorMessage =
              "Seems like you are fishing for team IDs... stop cheating";
            console.log("Looks like you are fishing for team IDs...");
          }
        } else {
          let gameId = "";
          let playerId = "";

          querySnapshot.forEach(function(doc) {
            gameId = doc.ref.parent.parent.id;
            playerId = doc.id;
          });

          this.$router.push({
            name: "player",
            params: { gameId, playerId }
          });
        }
      });
    }
  }
};
</script>
