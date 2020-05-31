import app from 'firebase/app'
import 'firebase/auth'
import firebase from 'firebase'
import { AppString } from './const';

export var firebaseConfig = {
   apiKey: "AIzaSyAkI6L37SKy8bC-YifwPB2mRLVnrB8zxtA",
   authDomain: "chatboio.firebaseapp.com",
   databaseURL: "https://chatboio.firebaseio.com",
   projectId: "chatboio",
   storageBucket: "chatboio.appspot.com",
   messagingSenderId: "1036935244521",
   appId: "1:1036935244521:web:66376231baee86ea99de78",
   measurementId: "G-5RHP65GK92"
};

class Firebase {
   constructor() {

      // Initialize Firebase
      !firebase.apps.length ? app.initializeApp(firebaseConfig) : firebase.app();
      app.analytics();
      this.auth = app.auth();
      this.firestore = app.firestore();
      this.rtDB = app.database();
      this.storage = app.storage();
      this.notification = app.messaging();
      this.functions = app.functions();
      
      // this.functions.useFunctionsEmulator('http://localhost:5001');

   }

   checkPresence = (userId) => {
      // let user = this.getCurrentUser().uid;
      let connectionRef = this.rtDB.ref(`status/${userId}/connections`);
      var lastOnlineRef = this.rtDB.ref(`status/${userId}/lastOnline`);
      let connectedRef = this.rtDB.ref('.info/connected');
      connectedRef.on('value', (snap) => {
         if (snap.val() === true) {
            let con = connectionRef.push();

            // update to firestore user is online
            con.then(() => {
               this.user(userId).update({
                  isOnline : true
               })
            })
            con.onDisconnect().remove();
            con.set(true);
            
            let timestamp = Date.now();
            lastOnlineRef.onDisconnect().set(timestamp).then(() => {
               console.log('offine');
               this.user(userId).update({
                  isOnline : true
                  
               })
               
            });
         }
      })
   }


   /** NOtification APi */
   getPermission = () =>
      this.notification.requestPermission().then(() => {
         console.log('have permission');
         let token = this.notification.getToken();


         return token

      })



   /** Delete User */
   deleteUser = () =>
      this.auth.currentUser.delete();

   /** AUTH API */

   doCreateUser = (email, password) =>
      this.auth.createUserWithEmailAndPassword(email, password);

   doSignIn = (email, password) =>
      this.auth.signInWithEmailAndPassword(email, password);
   doSignInWithGoogle = async () => {
      let provider = new firebase.auth.GoogleAuthProvider();
      return this.auth.signInWithPopup(provider);
   }

   doSignInWithFacebook = async () => {
      let provider = new firebase.auth.FacebookAuthProvider();
      return this.auth.signInWithPopup(provider);
   }

   doSignOut = () =>
      this.auth.signOut();

   doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

   doPasswordUpdate = newPassword => this.auth.currentUser.updatePassword(newPassword);

   /* USer Api */

   /** get current user profile */
   getCurrentUser = () => this.auth.currentUser;
   /**get user by uid */
   getUser = (uid) => this.firestore.collection(AppString.USERS).where(AppString.ID, '==', uid).get();
   /** get all users */
   getAllUsers = () => this.firestore.collection(AppString.USERS).get();

   user = (uid) => this.firestore.collection(AppString.USERS).doc(uid);

   message = (chatid) => this.firestore.collection(AppString.MESSAGES).doc(chatid).collection(chatid);

}

export default Firebase
