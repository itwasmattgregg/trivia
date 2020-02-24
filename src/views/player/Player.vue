<template>
  <div class="container">
    <div class="flex items-center justify-center min-h-full">
      <div class="text-2xl" v-if="currentGame.state === 'waiting'">
        Hi there. We're waiting for the game to start!
      </div>
      <QuestionAnswer
        v-else-if="currentGame.state === 'question'"
        :activeQuestion="currentGame.active_question"
      />
      <div v-else>
        Looks like your game master hasn't set up the game yet! Oops
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../../firebase";
import QuestionAnswer from "./QuestionAnswer.vue";

// TODO: Add a way better loading state

export default {
  name: "player",
  components: {
    QuestionAnswer
  },
  data() {
    return {
      currentGame: null
    };
  },
  firestore() {
    return {
      currentGame: db.collection("Games").doc(this.$route.params.gameId)
    };
  }
};
</script>
