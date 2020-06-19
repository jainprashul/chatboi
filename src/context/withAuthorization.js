import React, { useEffect, useContext } from 'react'

import { useRouter } from '../config/hooks';
import { FirebaseContext } from './FirebaseContext';
const withAuthorization = Component => props => {

    const firebase = useContext(FirebaseContext)
    const router = useRouter()
    useEffect(() => {
        let listener = firebase.auth.onAuthStateChanged(user => {
            if (!(user)) {
                router.history.replace('/screen')
            }
        })
        return () => {
            listener();
        }
    }, [firebase.auth, router.history])
    return (
        <Component {...props} />
    )
}

export default withAuthorization
