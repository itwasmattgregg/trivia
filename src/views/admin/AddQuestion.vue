<template>
  <div class="flex items-center justify-center">
    <div class="rounded px-8 py-4 shadow-lg bg-white my-8">
      <h1 class="text-2xl mb-4">Add Question</h1>
      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="question"
        >
          Question
        </label>
        <textarea
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="question"
          v-model="question"
          placeholder="What is the meaning of life...?"
        />
      </div>
      <div class="flex items-center justify-center">
        <button
          :class="
            `bg-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
            ${question.length === 0 && 'opacity-50'}`
          "
          type="button"
          :disabled="question.length === 0"
          @click="addQuestion"
        >
          Add Question
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../../firebase";

export default {
  name: "AddQuestion",
  data() {
    return {
      question: ""
    };
  },
  firestore() {
    return {
      questions: db
        .collection("Games")
        .doc(this.$route.params.id)
        .collection("Questions")
    };
  },
  methods: {
    addQuestion: function() {
      this.$firestore.questions
        .add({
          question: this.question
        })
        .then(() => {
          this.$router.push({
            name: "admin",
            params: { id: this.$route.params.id }
          });
        });
    }
  }
};
</script>
