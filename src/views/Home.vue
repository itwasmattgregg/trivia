<template>
  <div class="home p-8">
    <div class="inline-block p-8 border-solid border-white border rounded-lg">
      <h1>
        {{ games.length ? games[0].name : null }}
      </h1>
    </div>
  </div>
</template>

<script>
import { db } from "../firebase";

export default {
  name: "home",
  data() {
    return {
      games: null
    };
  },
  firestore() {
    return {
      games: db.collection("Games")
    };
  },
  mounted() {
    console.log(this);
  }
};
</script>
