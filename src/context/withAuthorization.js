import React, { useEffect, useContext } from 'react'
import { FirebaseContext } from '../../context/FirebaseContext'
import { useRouter } from '../config/hooks';
const withAuthorization = Component => props => {

    const firebase = useContext(FirebaseContext)
    const router = useRouter()
    useEffect(() => {
        let listener = firebase.auth.onAuthStateChanged(user => {
            if (!(user)) {
                router.history.replace('/signin')
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
