<template>
  <div>
    <div class="text-5xl">{{ question.question }}</div>
    <div class="text-2xl">Voting:</div>
    <div
      class="team-icon p-4 bg-blue shadow-lg rounded flex items-center justify-center font-bold"
      :data-voted="team.voted"
      v-for="team in voted"
      :key="team.name"
    >
      {{ team.name }}
    </div>
  </div>
</template>

<script>
import { db } from "../../firebase";

export default {
  name: "Voting",
  props: {
    activeQuestion: String
  },
  data() {
    return {
      teams: [],
      votes: []
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
      votes: db
        .collection("Games")
        .doc(this.$route.params.id)
        .collection("Questions")
        .doc(this.activeQuestion)
        .collection("Votes")
    };
  },
  computed: {
    // create array of merged teams with if they have voted yet
    voted() {
      return this.teams.map(team => {
        const hasVoted = this.votes.some(
          answer => answer[".key"] === team[".key"]
        );

        return {
          voted: hasVoted,
          name: team.team_name
        };
      });
    }
  },
  watch: {
    votes() {
      // Make sure there are teams loaded before checking this... it fires on load
      if (this.teams.length > 0 && this.votes.length === this.teams.length) {
        this.$emit("everyone-voted");
        // Maybe do all the scoring logic here???
      }
    }
  }
};
</script>

<style lang="postcss" scoped>
.team-icon {
  opacity: 0.3;
}
.team-icon[data-voted="true"] {
  opacity: 1;
}
</style>
