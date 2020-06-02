import React, { useState, useContext } from 'react'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardContent, IonProgressBar, IonButton, IonIcon, IonText, useIonViewDidEnter, useIonViewWillEnter, useIonViewDidLeave } from '@ionic/react'
import { logoGoogle, logoFacebook } from 'ionicons/icons';
import { FirebaseContext } from '../context/FirebaseContext';
import { createToast, useRouter, } from '../config/hooks';
import { AppString } from '../config/const';

let deferredPrompt;

const Login = () => {

    const firebase = useContext(FirebaseContext);
    let router = useRouter();
    const [installHide, setInstallHide] = useState(true);
    useIonViewWillEnter(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            // e.preventDefault();
            deferredPrompt = e;
            setInstallHide(false);
        });

        window.addEventListener('appinstalled', (event) => {
            console.log('👍', 'appinstalled', event);
        });
    })

    useIonViewDidEnter(() => {
        const tabbar = document.querySelector("ion-tab-bar");
        tabbar.classList.toggle('ion-hide', true);
    })

    useIonViewDidLeave(() => {
        console.log('login page out');
        const tabbar = document.querySelector("ion-tab-bar");
        tabbar.classList.toggle('ion-hide', false);

        
    })

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function saveDeviceToken() {
        const uid = firebase.getCurrentUser().uid;
        const token = await firebase.getPermission();
        // save it to firebase user file
        const tokenRef = firebase.user(uid).collection('tokens').doc(token);
        await tokenRef.set({
            token,
            createdAt: Date(),
        })
    }

    function signIn(doSignInWith) {
        setLoading(true);
        doSignInWith().then(async res => {
            let user = res.user;
            if (user) {
                await saveDeviceToken();
                const result = await firebase.getUser(user.uid);
                console.log(result);
                if (result.docs.length === 0) {
                    setNewUserData(user).then(() => {
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
                setError(null);
                router.replace('/');
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
                <IonButton hidden={installHide} color='dark' expand='full' onClick={() => {
                    const p = deferredPrompt;
                    if (!p) { return }
                    p.prompt();
                    p.userChoice.then(() => setInstallHide(true));

                }} >Install App</IonButton>
                <IonCard sizeMd='10' className='ion-padding ion-text-center'>
                    <IonCardHeader>
                        <IonTitle>Log In</IonTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonButton disabled={loading} onClick={() => { signIn(firebase.doSignInWithGoogle) }} size='default' expand='block'>Sign IN with  <IonIcon icon={logoGoogle} /></IonButton>
                        or
                        <IonButton disabled={loading} onClick={()=>{signIn(firebase.doSignInWithFacebook)}} size='default' expand='block'>Sign IN with  <IonIcon icon={logoFacebook} /></IonButton>
                        {error && <IonText class='red-text' >{error}</IonText>}
                    </IonCardContent>
                </IonCard>

            </IonContent>
        </IonPage>
    )
}

export default Login
