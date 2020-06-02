const functions = require('firebase-functions');
const admin = require('firebase-admin');
// const logo = require('./logo.png')

var firebaseConfig = {
    apiKey: "AIzaSyAkI6L37SKy8bC-YifwPB2mRLVnrB8zxtA",
    authDomain: "chatboio.firebaseapp.com",
    databaseURL: "https://chatboio.firebaseio.com",
    projectId: "chatboio",
    storageBucket: "chatboio.appspot.com",
    messagingSenderId: "1036935244521",
    appId: "1:1036935244521:web:66376231baee86ea99de78",
    measurementId: "G-5RHP65GK92"
};
admin.initializeApp(firebaseConfig);
const db = admin.firestore();
const fcm = admin.messaging();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
// exports.sendNotification = functions.firestore.document(path)

exports.subscribeToTopic = functions.firestore.document('users/{userId}/tokens/{token}').onCreate(async(snapshot, context) => {
    const token = snapshot.id;
    const topic = context.params.userId;
    console.log('Topic : '+ topic , " Token: "+ token);
    const subscription = fcm.subscribeToTopic(token, topic);
    console.log((await subscription).successCount);
    if ((await subscription).errors) {
        console.error((await subscription).errors);
    }
    
    return subscription;
    
})

exports.sendMsgNotification = functions.firestore.document(`messages/{chatId}/{chatCollectionId}/{msgTimestamp}`).onCreate( async (snap, contet) => {
    const msg = snap.data();
    let { context, idFrom, idTo, From , To, timestamp, type } = msg;
    // let userRef = await db.collection('users').doc(idFrom).get();
    // const user = userRef.ref.;
    // console.log(msg);
    // console.log(user, userRef);
    // const tokensSnap = await db.collection('users').doc(idTo).collection('tokens').get();
    // const tokens = tokensSnap.docs.map(doc => doc.id);
    // console.log(tokens);
    const notify = fcm.send({
        topic: idTo,
        // notification: {
        //     title: `${From} messaged you :`,
        //     body: type ? "Image received" : context,
        //     imageUrl: 'https://firebasestorage.googleapis.com/v0/b/chatboio.appspot.com/o/love.png?alt=media',
        // },
        data: {
            title: `${From} messaged you :`,
            body: type ? "Image received" : context,
            icon: 'https://firebasestorage.googleapis.com/v0/b/chatboio.appspot.com/o/love.png?alt=media',
        },
        webpush: {
            fcmOptions: {
                link: `https://chatboi.now.sh/chat?userId=${idFrom}`
            },
        }
    })
    
    console.log((await notify).toString());
    return notify;
});

exports.userDeleted = functions.auth.user().onDelete(user => {
    let uid = user.uid;
    db.collection('users').doc(uid).delete();
    console.log(uid, 'user data deleted');
    return;
});


