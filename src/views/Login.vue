<template>
  <div>
    <form @submit.prevent="signin">
      <h1 class="text-2xl mb-4">Admin Login</h1>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="team">
          Email
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          v-model="email"
          type="email"
          placeholder="jon-doe@nerdery.com"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="team">
          Password
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          v-model="password"
          type="password"
          placeholder="bleep bloop"
        />
      </div>
      <button
        type="submit"
        class="bg-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Login
      </button>
    </form>
  </div>
</template>

<script>
import { auth } from "../firebase";

export default {
  name: "login",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  created() {
    if (auth.currentUser) {
      this.$router.push("game-list");
    }
  },
  methods: {
    signin() {
      auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(user => {
          console.log(user, "success");
          this.$router.push("game-list");
        })
        .catch(function(error) {
          // Handle Errors here.
          console.log(error);
          // var errorCode = error.code;
          // var errorMessage = error.message;
        });
    }
  }
};
</script>
