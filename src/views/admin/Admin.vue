<template>
  <div class="container mx-auto px-4 mt-4">
    <Game
      v-if="current.matches('waiting')"
      v-on:question-clicked="initQuestion"
    />
    <div class="flex items-center justify-center min-h-full">
      <Question
        v-if="current.matches('question')"
        :activeQuestion="currentGame.active_question"
        v-on:everyone-answered="gameService.send('TOGGLE')"
      />
      <Voting
        v-if="current.matches('voting')"
        :activeQuestion="currentGame.active_question"
        v-on:everyone-voted="gameService.send('TOGGLE')"
      />
      <Scoring v-if="current.matches('scores')" />
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
      on: { TOGGLE: "question" }
    },
    question: {
      on: { TOGGLE: "voting" }
    },
    voting: {
      on: { TOGGLE: "scores" }
    },
    scores: {
      on: { TOGGLE: "waiting" }
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
      currentGame: db.collection("Games").doc(this.$route.params.id)
    };
  },
  methods: {
    initQuestion(questionKey) {
      this.$firestore.currentGame
        .set({ active_question: questionKey }, { merge: true })
        .then(() => {
          this.gameService.send("TOGGLE");
        });
    }
  }
};
</script>
