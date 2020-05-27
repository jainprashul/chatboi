import app from 'firebase/app'
import 'firebase/auth'
import firebase from 'firebase'
import { AppString } from './const';

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

class Firebase {
    constructor() {

        // Initialize Firebase
        !firebase.apps.length ? app.initializeApp(firebaseConfig) : firebase.app();
        app.analytics();
        this.auth = app.auth();
        this.firestore = app.firestore();
        this.storage = app.storage()
    }

    /** AUTH API */

    doCreateUser = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignIn = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);
    doSignInWithGoogle = async () => {
        let provider = new firebase.auth.GoogleAuthProvider();
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

    user = (uid)=> this.firestore.collection(AppString.USERS).doc(uid)
    /**get all users */
    


}

export default Firebase
