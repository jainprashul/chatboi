/* eslint-disable no-restricted-globals */
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
let url = '';
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon
  };
  url = payload.fcmOptions.link
  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
  const clickedNotification = event.notification;
  clickedNotification.close()
  let customUrl = url.replace('https://chatboi.now.sh', '')
  console.log('notify url : ' + customUrl);
  
  event.waitUntil(
    clients.matchAll({
      type: "window"
    })
      .then(function (clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          console.log(client);
          
          if (client.url && 'focus' in client)
            return client.focus();
        }
        if (clients.openWindow) {
          return clients.openWindow(customUrl);
        }
      })
  );
  
  // // Do something as the result of the notification click
  // const promiseChain = clients.openWindow(customUrl);
  // event.waitUntil(promiseChain);
});