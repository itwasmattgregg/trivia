<template>
  <div>
    <input type="email" v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />
    <button @click="signin">Login</button>
  </div>
</template>

<script>
import {auth} from '../firebase';

export default {
  name: "login",
  data() {
    return {
      email: '',
      password: '',
    }
  },
  created() {
    if(auth.currentUser) {
      this.$router.push('admin');
    }
  },
  methods: {
    signin() {
      auth.signInWithEmailAndPassword(this.email, this.password).then(user => {
          console.log(user, 'success');
          this.$router.push('admin')
        }
      ).catch(function(error) {
        // Handle Errors here.
        console.log(error)
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // ...
      });
    }
  }
};
</script>
