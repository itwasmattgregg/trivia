<template>
  <div class="container">
    <div class="flex items-center justify-center min-h-full text-center">
      <div class="team-name">{{ currentTeam.team_name }}</div>
      <div class="text-2xl" v-if="currentGame.state === 'waiting'">
        Hi there. Please wait for the next question.
      </div>
      <QuestionAnswer
        v-else-if="currentGame.state === 'question'"
        :activeQuestion="currentGame.active_question"
        :teamId="$route.params.teamId"
      />
      <PlayerVote
        v-else-if="currentGame.state === 'voting'"
        :activeQuestion="currentGame.active_question"
        :teamId="$route.params.teamId"
      />
      <PlayerScore
        v-else-if="currentGame.state === 'scoring'"
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
import PlayerVote from "./PlayerVote.vue";
import PlayerScore from "./PlayerScore.vue";

// TODO: Add a way better loading state

export default {
  name: "player",
  components: {
    QuestionAnswer,
    PlayerVote,
    PlayerScore
  },
  data() {
    return {
      currentGame: null,
      currentTeam: null
    };
  },
  firestore() {
    return {
      currentGame: db.collection("Games").doc(this.$route.params.gameId),
      currentTeam: {
        ref: db
          .collection("Games")
          .doc(this.$route.params.gameId)
          .collection("Teams")
          .doc(this.$route.params.teamId),
        reject: err => {
          console.error(err);
          this.$router.push({
            name: "home"
          });
        }
      }
    };
  }
};
</script>

<style lang="postcss" scoped>
.team-name {
  position: fixed;
  top: 20px;
  right: 20px;
}
</style>
