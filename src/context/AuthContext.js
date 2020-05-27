import React, { createContext, useState, useEffect, useContext } from "react";
import { FirebaseContext } from "./FirebaseContext";
// import { setConfig } from "../components/Config";

export const AuthUserContext = createContext();

const AuthContextProvider = (props) => {
    const [authUser, setAuthUser] = useState(null);
    const firebase = useContext(FirebaseContext);
    // setConfig('user', authUser);

    useEffect(() => {
        // console.log('authcontext', authUser);

        let listener = firebase.auth.onAuthStateChanged(user => {
            console.log('from change state');

            user ? setAuthUser(user) : setAuthUser(null);
            // user ? setConfig('user', user) : setConfig('user', null);
        },
            (err => console.log(err)
            ));

        return () => {
            listener();
        }
    }, [authUser, firebase.auth])
    return (
        <AuthUserContext.Provider value={{ authUser, setAuthUser }} >
            {props.children}
        </AuthUserContext.Provider>
    )
}

export default AuthContextProvider
