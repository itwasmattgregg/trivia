<template>
  <div>
    <button v-on:click="send('TOGGLE')">
      {{ current.matches("inactive") ? "Off" : "On" }}
    </button>
    <Game v-if="current.matches('inactive')" />
  </div>
</template>

<script>
import { db } from "../../firebase";
import { Machine, interpret } from "xstate";

import Game from "./Game.vue";

const toggleMachine = Machine({
  id: "toggle",
  initial: "inactive",
  states: {
    inactive: {
      on: { TOGGLE: "active" }
    },
    active: {
      on: { TOGGLE: "inactive" }
    }
  }
});

export default {
  name: "Admin",
  components: { Game },
  created() {
    // Start service on component creation
    this.toggleService
      .onTransition(state => {
        this.current = state;
      })
      .start();
  },
  data() {
    return {
      games: null,
      // Interpret machine and store it in data
      toggleService: interpret(toggleMachine),
      // Start with machine's initial state
      current: toggleMachine.initialState
    };
  },
  firestore() {
    return {
      games: db.collection("Games")
    };
  },
  methods: {
    // Send events to the service
    send(event) {
      this.toggleService.send(event);
    }
  }
};
</script>
