<template>
  <div class="text-center">
    <div class="text-6xl text-blue font-bold">{{ timer }}</div>
    <div class="text-5xl">{{ question.question }}</div>
    <div
      class="team-icon p-4 m-2 bg-blue shadow-lg rounded items-center justify-center font-bold"
      :class="team.answered ? 'inline-flex' : 'hidden'"
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
      answers: [],
      timer: 90,
      interval: null
    };
  },
  firestore() {
    return {
      game: {
        ref: db.collection("Games").doc(this.$route.params.id),
        resolve: () => {
          this.startTimer();
        }
      },
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
        this.questionCompleted();
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    // Something here to fire when it's all over
    questionCompleted() {
      if (this.answers.length === 0) {
        this.$emit("cancel");
      } else {
        // TODO: maybe remove this and just calculate it every time from admin??
        // Once everyone has answer the question becomes locked so it can never
        // be clicked again.
        this.$firestore.question.set({ answered: true }, { merge: true });
        this.$emit("everyone-answered");
      }
    },

    startTimer() {
      this.$firestore.game
        .set({ endTime: new Date(Date.now() + 1000 * 92) }, { merge: true })
        .then(() => {
          const end = new Date(this.game.endTime.seconds * 1000);
          this.interval = setInterval(() => {
            const now = Date.now();

            if (this.timer > 0) {
              this.timer = Math.floor((end - now) / 1000);
            } else {
              this.questionCompleted();
            }
          }, 1000);
        });
    }
  }
};
</script>

