<template>
  <div>
    <div class="text-5xl">{{ question.question }}</div>
    <div
      class="team-icon p-4 bg-blue shadow-lg rounded flex items-center justify-center font-bold"
      :data-answered="team.answered"
      v-for="team in answered"
      :key="team.name"
    >
      {{ team.name }}
    </div>
  </div>
</template>

<script>
import { db } from "../../firebase";

export default {
  name: "Question",
  props: {
    activeQuestion: String
  },
  data() {
    return {
      teams: [],
      answers: []
    };
  },
  firestore() {
    return {
      question: db
        .collection("Games")
        .doc(this.$route.params.id)
        .collection("Questions")
        .doc(this.activeQuestion),
      teams: db
        .collection("Games")
        .doc(this.$route.params.id)
        .collection("Teams"),
      answers: db
        .collection("Games")
        .doc(this.$route.params.id)
        .collection("Questions")
        .doc(this.activeQuestion)
        .collection("Answers")
    };
  },
  computed: {
    // create array of merged teams with if they have answered the question yet
    answered() {
      return this.teams.map(team => {
        const hasAnswered = this.answers.some(
          answer => answer[".key"] === team[".key"]
        );

        return {
          answered: hasAnswered,
          name: team.team_name
        };
      });
    }
  },
  watch: {
    answers() {
      // Make sure there are teams loaded before checking this... it fires on load
      if (this.teams.length > 0 && this.answers.length === this.teams.length) {
        this.$emit("everyone-answered");
        // TODO: maybe remove this and just calculate it every time from admin??
        // Once everyone has answer the question becomes locked so it can never
        // be clicked again.
        // this.$firestore.question.set({ answered: true }, { merge: true });
      }
    }
  }
};
</script>

<style lang="postcss" scoped>
.team-icon {
  display: none;
}
.team-icon[data-answered="true"] {
  display: inline-block;
}
</style>
