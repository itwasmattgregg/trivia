<template>
  <div>
    <div
      class="relative p-4 mb-8 mx-4 bg-blue shadow-lg rounded font-bold text-center"
      v-for="team in teamsOrdered"
      :key="team.team_name"
    >
      {{ team.team_name }} -
      {{ team.score }}
      <div>
        "{{ answers.find(answer => answer[".key"] === team[".key"]).answer }}"
      </div>
      <div class="score-change" v-if="scoreChangesThisRound[team['.key']]">
        + {{ scoreChangesThisRound[team[".key"]] }}
      </div>
      <div class="score-change" v-else>
        + 0
      </div>
    </div>
    <button
      class="bg-white border-blue border-solid border-2 hover:bg-blue-700 font-bold mt-8 py-2 px-4 rounded focus:shadow-outline"
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
        .collection("Votes"),
      answers: db
        .collection("Games")
        .doc(this.$route.params.id)
        .collection("Questions")
        .doc(this.activeQuestion)
        .collection("Answers")
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
          const teamToScore = doc.data().answerId;
          const currentScore = this.scoreChangesThisRound[teamToScore] ?? 0;

          this.scoreChangesThisRound[teamToScore] = currentScore + 10;
        });
      })
      .then(() => {
        Object.keys(this.scoreChangesThisRound).forEach(key => {
          const teamRef = this.$firestore.teams.doc(key);

          teamRef
            .get()
            .then(doc => {
              if (doc.exists) {
                const teamScore =
                  doc.data().score + this.scoreChangesThisRound[key];
                teamRef.set({ score: teamScore }, { merge: true });
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
