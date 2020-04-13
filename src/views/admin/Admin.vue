<template>
  <div class="container mx-auto px-4 mt-4 pb-4">
    <Game
      v-if="current.matches('waiting')"
      v-on:question-clicked="initQuestion"
    />
    <div
      v-if="!current.matches('waiting')"
      class="flex items-center justify-center min-h-full"
    >
      <Question
        v-if="current.matches('question')"
        :activeQuestion="currentGame.active_question"
        v-on:everyone-answered="gameService.send('NEXT')"
        v-on:cancel="gameService.send('CANCEL')"
      />
      <Voting
        v-if="current.matches('voting')"
        :activeQuestion="currentGame.active_question"
        v-on:everyone-voted="gameService.send('NEXT')"
      />
      <Scoring
        v-if="current.matches('scoring')"
        :activeQuestion="currentGame.active_question"
        v-on:scoring-complete="gameService.send('NEXT')"
      />
    </div>
  </div>
</template>

<script>
import { db } from "../../firebase";
import { Machine, interpret } from "xstate";

import Game from "./Game.vue";
import Question from "./Question.vue";
import Voting from "./Voting.vue";
import Scoring from "./Scoring.vue";

// TODO: change question back to going to scores
const gameMachine = Machine({
  id: "toggle",
  initial: "waiting",
  states: {
    waiting: {
      on: { NEXT: "question" }
    },
    question: {
      on: { NEXT: "voting", CANCEL: "waiting" }
    },
    voting: {
      on: { NEXT: "scoring", CANCEL: "waiting" }
    },
    scoring: {
      on: { NEXT: "waiting" }
    }
  }
});

export default {
  name: "Admin",
  components: { Game, Voting, Question, Scoring },
  created() {
    // Start service on component creation
    this.gameService
      .onTransition(state => {
        this.current = state;

        // keep firestore up to date with current game state
        this.$firestore.currentGame.set(
          { state: state.value },
          { merge: true }
        );
      })
      .start();
  },
  data() {
    return {
      // Interpret machine and store it in data
      gameService: interpret(gameMachine),
      // Start with machine's initial state
      current: gameMachine.initialState
    };
  },
  firestore() {
    return {
      currentGame: db.collection("Games").doc(this.$route.params.id),
      teams: db
        .collection("Games")
        .doc(this.$route.params.id)
        .collection("Teams")
    };
  },
  methods: {
    initQuestion(questionKey) {
      // TODO: turn this back on
      // if (this.teams.length < 3) {
      //   console.log("You need more than 2 teams to play.");
      //   return;
      // }
      this.$firestore.currentGame
        .set(
          {
            active_question: questionKey
          },
          { merge: true }
        )
        .then(() => {
          this.gameService.send("NEXT");
        });
    }
  }
};
</script>
