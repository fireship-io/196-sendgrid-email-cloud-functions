<script>
	import firebase from 'firebase/app';
	import { auth, functions } from './firebase';
	import { onMount } from 'svelte';

	let user = null;

	onMount(async () => {
		auth.onAuthStateChanged(u => user = u);
	});

	function sendEmail() {
		const callable = functions.httpsCallable('genericEmail');
		return callable({ text: 'Sending email with Svelte and SendGrid is fun!', subject: 'Email from Svelte'}).then(console.log);
	}
	
</script>
<h2>SendGrid Transactional Email with Svelte</h2>

{#if user}
	<p>{ JSON.stringify(user) }</p>
    <button on:click={() => sendEmail()}>Send Email with Callable Function</button>
    <button on:click={() => auth.signOut()}>SignOut</button>

{:else}
	<button on:click={() => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())}>SignIn with Google</button>
{/if}
