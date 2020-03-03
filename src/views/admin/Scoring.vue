<template>
  <div>
    Scoring

    <div
      class="team-icon p-4 bg-blue shadow-lg rounded flex items-center justify-center font-bold"
      v-for="team in teams"
      :key="team.team_name"
    >
      {{ team.team_name }} -
      {{ team.score }}
    </div>
    <button @click="$emit('scoring-complete')">Back to question list</button>
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
          const teamRef = this.$firestore.teams.doc(teamToScore);

          teamRef
            .get()
            .then(doc => {
              if (doc.exists) {
                // If they have a score use that as starting point, otherwise 0
                const teamScore = doc.data().score ?? 0;
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
