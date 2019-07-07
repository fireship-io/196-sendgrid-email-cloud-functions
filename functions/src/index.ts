// Firebase Config
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
const db = admin.firestore();

// Sendgrid Config
import * as sgMail from '@sendgrid/mail';

const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);


// Functions

// Sends email to user after signup
export const welcomeEmail = functions.auth.user().onCreate(user => {

    const msg = {
        to: user.email,
        from: 'hello@fireship.io',
        templateId: TEMPLATE_ID,
        dynamic_template_data: {
            subject: 'Welcome to my awesome app!',
            name: user.displayName,
        },
    };

    return sgMail.send(msg);

});

// Sends email via HTTP. Can be called from frontend code. 
export const genericEmail = functions.https.onCall(async (data, context) => {


    if (!context.auth && !context.auth.token.email) {
        throw new functions.https.HttpsError('failed-precondition', 'Must be logged with an email address');
    }

    const msg = {
        to: context.auth.token.email,
        from: 'hello@fireship.io',
        templateId: TEMPLATE_ID,
        dynamic_template_data: {
            subject: data.subject,
            name: data.text,
        },
    };

    await sgMail.send(msg);

    // Handle errors here

    // Response must be JSON serializable
    return { success: true };

});

// Emails the author when a new comment is added to a post
export const newComment = functions.firestore.document('posts/{postId}/comments/{commentId}').onCreate( async (change, context) => {

    // Read the post document
    const postSnap = await db.collection('posts').doc(context.params.postId).get();

    // Raw Data
    const post = postSnap.data() || {};
    const comment = change.data() || {};

    // Email
    const msg = {
        to: post.authorEmail,
        from: 'hello@fireship.io',
        templateId: TEMPLATE_ID,
        dynamic_template_data: {
            subject: `New Comment on ${post.title}`,
            name: post.displayName,
            text: `${comment.user} said... ${comment.text}`
        },
    };

    // Send it
    return sgMail.send(msg);

});

// Send a summary email to all users 
export const weeklySummary =  functions.pubsub.schedule('every friday 05:00').onRun(async context => {
    const userSnapshots = await admin.firestore().collection('users').get();

    const emails = userSnapshots.docs.map(snap => snap.data().email);

    const msg = {
        to: emails,
        from: 'hello@fireship.io',
        templateId: TEMPLATE_ID,
        dynamic_template_data: {
            subject: `Your Weekly Summary`,
            text: 'Insert summary here...'
        },
    };

    return sgMail.send(msg);

});