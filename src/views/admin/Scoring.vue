<template>
  <div>
    <div
      class="relative p-4 mb-8 bg-blue shadow-lg rounded flex items-center justify-center font-bold"
      v-for="team in teamsOrdered"
      :key="team.team_name"
    >
      {{ team.team_name }} -
      {{ team.score }}
      <div class="score-change" v-if="scoreChangesThisRound[team['.key']]">
        + {{ scoreChangesThisRound[team[".key"]] }}
      </div>
    </div>
    <button
      class="bg-blue hover:bg-blue-700 font-bold mt-8 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      type="button"
      @click="$emit('scoring-complete')"
    >
      Back to question list
    </button>
  </div>
</template>

<script>
import { db } from "../../firebase";

export default {
  name: "Scoring",
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
      question: db
        .collection("Games")
        .doc(this.$route.params.id)
        .collection("Questions")
        .doc(this.activeQuestion),
      teams: db
        .collection("Games")
        .doc(this.$route.params.id)
        .collection("Teams"),
      teamsOrdered: db
        .collection("Games")
        .doc(this.$route.params.id)
        .collection("Teams")
        .orderBy("score", "desc"),
      votes: db
        .collection("Games")
        .doc(this.$route.params.id)
        .collection("Questions")
        .doc(this.activeQuestion)
        .collection("Votes")
    };
  },
  created() {
    this.$firestore.votes
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log("No matching documents.");
          return;
        }

        // For each vote give points to team voted for
        snapshot.forEach(doc => {
          const teamToScore = doc.data().teamId;
          const currentScore = this.scoreChangesThisRound[teamToScore] ?? 0;

          this.scoreChangesThisRound[teamToScore] = currentScore + 10;

          const teamRef = this.$firestore.teams.doc(teamToScore);

          teamRef
            .get()
            .then(doc => {
              if (doc.exists) {
                // If they have a score use that as starting point, otherwise 0
                const teamScore = doc.data().score ?? 0;
                console.log(teamScore);
                teamRef.set({ score: teamScore + 10 }, { merge: true });
              } else {
                console.log("No such document!");
                return;
              }
            })
            .catch(function(error) {
              console.log("Error getting document:", error);
            });
        });
      })
      .catch(err => {
        console.log("Error getting documents", err);
      });
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
