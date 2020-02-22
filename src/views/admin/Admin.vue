<template>
  <div>
    <Game
      v-if="current.matches('waiting')"
      v-on:question-clicked="initQuestion"
    />
    <Question v-if="current.matches('question')" />
    <Voting v-if="current.matches('voting')" />
    <Scoring v-if="current.matches('scoring')" />
  </div>
</template>

<script>
import { db } from "../../firebase";
import { Machine, interpret } from "xstate";

import Game from "./Game.vue";
import Question from "./Question.vue";
import Voting from "./Voting.vue";
import Scoring from "./Scoring.vue";

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
      currentGame: null,
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
    // Send events to the service
    send(event) {
      this.gameService.send(event);
    },
    initQuestion(questionKey) {
      this.gameService.send("TOGGLE");

      this.$firestore.currentGame.set(
        { active_question: questionKey },
        { merge: true }
      );
    }
  }
};
</script>
