import React, { useState } from 'react';
import './App.css';

import * as firebase from 'firebase/app';
import { auth, functions } from './firebase';

function App() {

  const [user, setUser] = useState(null);

  auth.onAuthStateChanged(setUser);

  return (
    <div className="App">
      <h2>SendGrid Transactional Email with React</h2>
      {user ? signOutUI(user) : signInUI() }
    </div>
  );
}

function signInUI() {
  return (
    <div>
      <button onClick={() => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())}>SignIn with Google</button>
    </div>
  )
}

function signOutUI(user) {
  return (
    <div>
      
      <p>{ JSON.stringify(user) }</p>

      <hr />

      <button onClick={() => sendEmail()}>Send Email with Callable Function</button>
      <button onClick={() => auth.signOut()}>SignOut</button>
    </div>
  )
}
function sendEmail() {
  const callable = functions.httpsCallable('genericEmail');
  return callable({ text: 'Sending email with React and SendGrid is fun!', subject: 'Email from React'}).then(console.log)
}

export default App;
