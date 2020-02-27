<template>
  <div v-if="!submitted">
    <div class="text-5xl">{{ question.question }}</div>
    <div class="mb-4 text-left">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="answer">
        Write your answer here
      </label>
      <textarea
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="answer"
        v-model="answer"
        placeholder="No answer is wrong, just like no question is stupid..."
      />
    </div>
    <div class="flex items-center justify-center">
      <button
        :class="
          `bg-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
            ${answer.length === 0 && 'opacity-50'}`
        "
        type="button"
        :disabled="answer.length === 0"
        @click="submit"
      >
        Submit
      </button>
    </div>
  </div>
  <div v-else>
    <div class="text-2xl">Your answer has been submitted!</div>
  </div>
</template>

<script>
import { db } from "../../firebase";

export default {
  name: "QuestionAnswer",
  props: {
    activeQuestion: String,
    teamId: String
  },
  data() {
    return {
      answer: "",
      submitted: false
    };
  },
  created() {
    // Check if answer has been submitted already
    db.collection("Games")
      .doc(this.$route.params.gameId)
      .collection("Questions")
      .doc(this.activeQuestion)
      .collection("Answers")
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
        .doc(this.activeQuestion)
    };
  },
  methods: {
    submit() {
      this.$firestore.question
        .collection("Answers")
        .doc(this.teamId)
        .set({
          answer: this.answer
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
