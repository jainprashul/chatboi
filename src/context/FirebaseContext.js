import { createContext } from "react";
import React from 'react'
import Firebase from "../config/firebase";
export const FirebaseContext = createContext();

let firebase = new Firebase();

const FirebaseContextProvider = (props) => {
    return (
        <FirebaseContext.Provider value={firebase}>
            {props.children}
        </FirebaseContext.Provider>
    )
}


export async function saveDeviceToken() {
    const uid = firebase.getCurrentUser().uid;
    const token = await firebase.getPermission();
    console.log(token);
    if (token) {
        // save it to firebase user file
        const tokenRef = firebase.user(uid).collection('tokens').doc(token);
        await tokenRef.set({
            token,
            createdAt: Date(),
        })
    }
}

export default FirebaseContextProvider
