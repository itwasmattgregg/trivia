<template>
  <div class="text-5xl">{{ question.question }}</div>
</template>

<script>
import { db } from "../../firebase";

export default {
  name: "QuestionAnswer",
  props: {
    activeQuestion: String
  },
  firestore() {
    return {
      question: db
        .collection("Games")
        .doc(this.$route.params.gameId)
        .collection("Questions")
        .doc(this.activeQuestion)
    };
  }
};
</script>

<style>
</style>
