<template>
  <div class="grid gap-4 grid-cols-4">
    <div class="teams rounded shadow-lg bg-white p-4 pb-12 relative">
      <h2 class="text-xl mb-4">Scores</h2>
      <ul>
        <li
          v-for="team in teams"
          :key="team['.key']"
          class="team font-semibold"
          tabindex="0"
        >
          <span class="team-name">{{ team.team_name }}</span>
          <span class="team-hash">{{ team.hash }}</span>
          {{ team.score || "0" }}
        </li>
      </ul>
      <router-link
        :to="{ name: 'add-team', params: { id: $route.params.id } }"
        class="rounded-full bg-gray-200 px-4 absolute bottom-0 right-0 m-4"
      >
        Add team +
      </router-link>
    </div>
    <div class="questions col-span-3 rounded shadow-lg bg-white p-4">
      <h2 class="text-xl mb-4">Questions</h2>
      <div class="grid gap-4 grid-cols-3">
        <button
          v-for="(question, index) in questions"
          :key="question['.key']"
          :disabled="question.answered"
          @click="initQuestion(question['.key'])"
          class="p-4 h-32 bg-blue shadow-lg rounded flex items-center justify-center text-xl font-bold"
          :class="{ 'opacity-50': question.answered }"
        >
          {{ index + 1 }}
        </button>
        <router-link
          :to="{ name: 'add-question', params: { id: $route.params.id } }"
        >
          <div
            class="h-32 bg-gray-200 shadow-lg rounded flex items-center justify-center text-6xl"
          >
            +
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../../firebase";

export default {
  name: "Game",
  firestore() {
    return {
      teams: db
        .collection("Games")
        .doc(this.$route.params.id)
        .collection("Teams")
        .orderBy("score", "desc"),
      questions: db
        .collection("Games")
        .doc(this.$route.params.id)
        .collection("Questions")
    };
  },
  methods: {
    initQuestion(key) {
      this.$emit("question-clicked", key);
    }
  }
};
</script>

<style lang="postcss" scoped>
.team {
  display: flex;
  justify-content: space-between;
}
.team-hash {
  display: none;
}
.team:focus .team-hash {
  display: inline-block;
}
.team:focus .team-name {
  display: none;
}
</style>
