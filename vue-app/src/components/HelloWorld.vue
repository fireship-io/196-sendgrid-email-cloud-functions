<template>
<div>

    
  <div v-if="user">

    {{ JSON.stringify(user) }}
    
    <hr>

      <button v-on:click="sendEmail()">Send Email with Callable Function</button>
      <button v-on:click="signOut()">Sign Out</button>

  </div>



  <div v-else>
    <button v-on:click="signInWithGoogle()">Login with Google</button>
  </div>

</div>


</template>

<script>

import * as firebase from 'firebase/app';
import { auth, functions } from '../firebase';

export default {
  name: 'HelloWorld',
  data: function () {
    return {
      user: null,
      bar: 1
    }
  },
  beforeCreate: function() {
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
    })
  },
  methods: {
    signInWithGoogle: function() {
      return auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    },
    signOut: function() {
      return auth.signOut();
    },
    sendEmail: function() {
      const callable = functions.httpsCallable('genericEmail');
      return callable({ text: 'Sending email with Vue and SendGrid is fun!', subject: 'Email from Vue'}).then(console.log);
    },
  }
}
</script>


<style scoped>

</style>
