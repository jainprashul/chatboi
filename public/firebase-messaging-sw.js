/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/7.14.5/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.5/firebase-messaging.js');
// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    projectId: "chatboio",
    apiKey: "AIzaSyAkI6L37SKy8bC-YifwPB2mRLVnrB8zxtA",
    appId: "1:1036935244521:web:66376231baee86ea99de78",
    messagingSenderId: "1036935244521",
});
// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  // eslint-disable-next-line no-restricted-globals
  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});