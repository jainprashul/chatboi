import React, { useState, useContext } from 'react'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardContent, IonProgressBar, IonButton, IonIcon, IonText, useIonViewDidEnter, useIonViewWillEnter, useIonViewDidLeave, IonInput, IonItem, IonLabel } from '@ionic/react'
import { logoGoogle, logoFacebook } from 'ionicons/icons';
import { FirebaseContext } from '../context/FirebaseContext';
import { createToast, useRouter, } from '../config/hooks';
import { AppString } from '../config/const';
import {loadingController } from '@ionic/core'

let deferredPrompt;
let verifyPhoneNum;

const Login = () => {

    const firebase = useContext(FirebaseContext);
    let router = useRouter();
    const [installHide, setInstallHide] = useState(true);
    const [phoneNo, setPhoneNo] = useState('');
    const [verifyCode, setVerifyCode] = useState('');
    const [showVerification, setShowVerification] = useState(false);
    const [loadin, setLoadin] = useState(false)

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

    

    function signIn(doSignInWith) {
        setLoading(true);
        doSignInWith.then(async res => {
            let user = res.user;
            if (user) {                
                const result = await firebase.getUser(user.uid);
                // console.log(result);
                if (result.docs.length === 0) {
                    setNewUserData(user).then((res) => {
                        // save to local
                        localStorage.setItem(AppString.ID, res.id);
                        localStorage.setItem(AppString.NICKNAME, res.nickname);
                        localStorage.setItem(AppString.PHOTO_URL, res.photoUrl);
                        localStorage.setItem(AppString.PHOTO_URL, res.aboutMe);
                    })

                    router.replace('/profile')
                } else {
                    let { id, nickname, photoUrl, aboutMe } = result.docs[0].data();

                    // save to local
                    localStorage.setItem(AppString.ID, id);
                    localStorage.setItem(AppString.NICKNAME, nickname);
                    localStorage.setItem(AppString.PHOTO_URL, photoUrl);
                    localStorage.setItem(AppString.ABOUT_ME, aboutMe);
                    router.replace('/');

                }
                createToast("Login Sucess..")
                // await saveDeviceToken();
                setLoading(false);
                setError(null);
            }

        }).catch(err => {
            console.log(err);
            setLoading(false); 
            setError(err.message)
        })
    }

    async function setNewUserData(userData) {

        console.log(userData);
        let nickname = userData.phoneNumber ? userData.phoneNumber : 'usr-'+ userData.displayName
        let photoURL = userData.photoURL ? userData.photoURL : 'https://image.flaticon.com/icons/svg/847/847969.svg'
        const newUser = {
            id: userData.uid,
            email: userData.email,
            nickname: nickname,
            aboutMe: '',
            photoUrl: photoURL,
            phoneNumber: userData.phoneNumber
        }
        await firebase.user(userData.uid).set(newUser);
        return newUser
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{AppString.APP_NAME}</IonTitle>
                </IonToolbar>
                <IonProgressBar hidden={!loading || !loadin} type='indeterminate'></IonProgressBar>

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
                        <IonButton disabled={loading} onClick={() => { signIn(firebase.doSignInWithGoogle()) }} size='default' expand='block'>Sign IN with  <IonIcon icon={logoGoogle} /></IonButton>
                        or
                        <IonButton disabled={loading} onClick={()=>{signIn(firebase.doSignInWithFacebook())}} size='default' expand='block'>Sign IN with  <IonIcon icon={logoFacebook} /></IonButton>
                        {error && <IonText class='red-text' >{error}</IonText>}
                    </IonCardContent>
                </IonCard>
                or
                <IonCard sizeMd='10' className='ion-padding ion-text-center'>
                    <IonCardHeader>
                        <IonTitle>Log In With Phone</IonTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <div hidden={showVerification}>
                            <IonItem>
                                <IonLabel position='stacked'>Phone</IonLabel>
                                <IonInput placeholder="Phone Number" value={phoneNo} type='number' debounce={800} onIonChange={(e) => setPhoneNo(e.target.value)} ></IonInput>
                            </IonItem>
                            <div id='recaptcha_verifier'></div>
                            <IonButton  disabled={loadin} onClick={() => {
                                setLoadin(true)
                                loadingController.create({
                                    message: 'Signing In ..',
                                    spinner: 'dots',
                                    animated: true
                                }).then(r => r.present());
                                var appVerifier = new firebase.app.auth.RecaptchaVerifier(
                                    'recaptcha_verifier', { 
                                        'size': 'invisible',
                                        'callback': function (response) {
                                            // reCAPTCHA solved, allow signInWithPhoneNumber.
                                            console.log('success', response);
                                            
                                        }
                                    });;

                                firebase.doSignInWithPhoneNumber('+91' + phoneNo, appVerifier).then(async (confirmationRes) => {
                                    loadingController.dismiss();
                                    verifyPhoneNum = confirmationRes;
                                    setShowVerification(true)
                                })
                            }} size='default' >Login</IonButton>
                        </div>
                        
                        <div hidden={!showVerification}>
                            <IonItem>
                                <IonLabel position='stacked'>Code</IonLabel>
                                <IonInput placeholder="Code" value={verifyCode} type='number' debounce={800} onIonChange={(e) => setVerifyCode(e.target.value)} ></IonInput>
                            </IonItem>
                            <IonButton disabled={loading} onClick={() => {
                                signIn(verifyPhoneNum.confirm(verifyCode))
                            }} size='default' >Verify</IonButton>
                        </div>
                        
                    </IonCardContent>
                </IonCard>

            </IonContent>
        </IonPage>
    )
}

export default Login
