import { Component } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public afAuth: AngularFireAuth, private fun: AngularFireFunctions) {}



  loginWithGoogle() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  sendEmail() {
    const callable = this.fun.httpsCallable('genericEmail');
    callable({ text: 'Sending email with Angular and SendGrid is fun!', subject: 'Email from Angular'}).subscribe();
  }
}
