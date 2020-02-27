<template>
  <div v-if="!submitted">
    <div class="text-5xl">{{ question.question }}</div>
    <p class="text-lg mb-8">Vote for one of the answers below</p>
    <button
      class="block mb-4 bg-white text-left w-full p-4 text-lg rounded border-gray-400 border-solid border-2 transition	duration-100 transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-lg"
      v-for="answer in shuffledAnswers"
      :key="answer['.key']"
      @click="vote(answer['.key'])"
    >
      {{ answer.answer }}
    </button>
  </div>
  <div v-else>
    Your vote has been submitted!
  </div>
</template>

<script>
import { db } from "../../firebase";

export default {
  name: "PlayerVote",
  props: {
    activeQuestion: String,
    teamId: String
  },
  data() {
    return {
      answers: [],
      submitted: false
    };
  },
  created() {
    // Check if vote has been submitted already
    db.collection("Games")
      .doc(this.$route.params.gameId)
      .collection("Questions")
      .doc(this.activeQuestion)
      .collection("Votes")
      .doc(this.teamId)
      .get()
      .then(doc => {
        if (doc.exists) {
          this.submitted = true;
        }
      });
  },
  firestore() {
    return {
      question: db
        .collection("Games")
        .doc(this.$route.params.gameId)
        .collection("Questions")
        .doc(this.activeQuestion),
      answers: db
        .collection("Games")
        .doc(this.$route.params.gameId)
        .collection("Questions")
        .doc(this.activeQuestion)
        .collection("Answers")
    };
  },
  computed: {
    removeOwnAnswer() {
      return this.answers.filter(answer => answer[".key"] !== this.teamId);
    },
    shuffledAnswers() {
      let array = this.removeOwnAnswer;
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  },
  methods: {
    vote(answerId) {
      // TODO: maybe lock out clicking buttons while submitting?
      this.$firestore.question
        .collection("Votes")
        .doc(this.teamId)
        .set({
          answerId: answerId
        })
        .then(() => {
          this.submitted = true;
        });
    }
  }
};
</script>

<style>
</style>
