<template>
  <div>
    <div
      class="relative p-4 mb-8 bg-blue shadow-lg rounded font-bold"
      v-for="team in teamsOrdered"
      :key="team.team_name"
    >
      {{ team.team_name }} -
      {{ team.score }}
      <div>
        "{{ answers.find(answer => answer[".key"] === team[".key"]).answer }}"
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../../firebase";

export default {
  name: "PlayerScore",
  props: {
    activeQuestion: String
  },
  data() {
    return {
      votes: [],
      scoreChangesThisRound: {}
    };
  },
  firestore() {
    return {
      teamsOrdered: db
        .collection("Games")
        .doc(this.$route.params.gameId)
        .collection("Teams")
        .orderBy("score", "desc"),
      answers: db
        .collection("Games")
        .doc(this.$route.params.gameId)
        .collection("Questions")
        .doc(this.activeQuestion)
        .collection("Answers")
    };
  }
};
</script>

<style lang="postcss" scoped>
.score-change {
  position: absolute;
  top: -15px;
  left: 90%;
  background: white;
  padding: 5px;
  border-radius: 5px;
  text-align: left;
  white-space: nowrap;
}
</style>
