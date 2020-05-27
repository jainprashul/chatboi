import React, { useState, useContext } from 'react'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardContent, IonProgressBar, IonButton, IonIcon, IonText, useIonViewDidEnter } from '@ionic/react'
import { logoGoogle } from 'ionicons/icons';
import { FirebaseContext } from '../context/FirebaseContext';
import { createToast, useRouter, } from '../config/hooks';
import { AppString } from '../config/const';

const Login = () => {

    const firebase = useContext(FirebaseContext);
    let router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    function signIn(doSignInWith) {
        setLoading(true);
        doSignInWith().then(async res => {
            let user = res.user;

            if (user) {
                const result = await firebase.getUser(user.uid);
                console.log(result);
                if (result.docs.length === 0) {
                    setNewUserData(user).then(data => {
                        // save to local
                        localStorage.setItem(AppString.ID, user.uid);
                        localStorage.setItem(AppString.NICKNAME, user.displayName);
                        localStorage.setItem(AppString.PHOTO_URL, user.photoURL);


                    })
                } else {
                    let { id, nickname, photoUrl, aboutMe } = result.docs[0].data();

                    // save to local
                    localStorage.setItem(AppString.ID, id);
                    localStorage.setItem(AppString.NICKNAME, nickname);
                    localStorage.setItem(AppString.PHOTO_URL, photoUrl);
                    localStorage.setItem(AppString.ABOUT_ME, aboutMe);

                }
                createToast("Login Sucess..")
                setLoading(false);
                router.push('/');
            }

        }).catch(err => {
            console.log(err);
            setLoading(false);
            setError(err.message)
        })
    }

    function setNewUserData(userData) {
        return firebase.user(userData.uid).set({
            id: userData.uid,
            email: userData.email,
            nickname: userData.displayName,
            aboutMe: '',
            photoUrl: userData.photoURL
        })
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Chat BOI</IonTitle>
                </IonToolbar>
                <IonProgressBar hidden={!loading} type='indeterminate'></IonProgressBar>

            </IonHeader>
            <IonContent className='ion-margin ion-padding ion-text-center'>
                <IonCard sizeMd='10' className='ion-padding ion-text-center'>
                    <IonCardHeader>
                        <IonTitle>Log In</IonTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonButton disabled={loading} onClick={()=>{signIn(firebase.doSignInWithGoogle)}} size='default' expand='block'>Sign IN with  <IonIcon icon={logoGoogle} /></IonButton>
                        {error && <IonText class='red-text' >{error}</IonText>}
                    </IonCardContent>
                </IonCard>

            </IonContent>
        </IonPage>
    )
}

export default Login
