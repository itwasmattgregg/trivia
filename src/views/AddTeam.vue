<template>
  <div class="flex items-center justify-center">
    <div class="rounded px-8 py-4 shadow-lg bg-white my-8">
      <h1 class="text-2xl mb-4">Add Team</h1>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="team">
          Team Name
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="team"
          v-model="team"
          type="text"
          placeholder="Enter team name"
        />
      </div>
      <div class="flex items-center justify-center">
        <button
          :class="
            `bg-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
            ${team.length === 0 && 'opacity-50'}`
          "
          type="button"
          :disabled="team.length === 0"
          @click="addTeam"
        >
          Add Team
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../firebase";

export default {
  name: "AddTuestion",
  data() {
    return {
      team: ""
    };
  },
  firestore() {
    return {
      teams: db
        .collection("Games")
        .doc(this.$route.params.id)
        .collection("Teams")
    };
  },
  methods: {
    addTeam: function() {
      this.$firestore.teams
        .add({
          team_name: this.team
        })
        .then(() => {
          this.$router.push({
            name: "game",
            params: { id: this.$route.params.id }
          });
        });
    }
  }
};
</script>
