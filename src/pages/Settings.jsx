import React, { useContext } from 'react'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonBackButton, IonIcon } from '@ionic/react'
import { alertController } from '@ionic/core';
import { FirebaseContext } from '../context/FirebaseContext';
import { logOut, share, shareSocial } from 'ionicons/icons';
import withAuthorization from '../context/withAuthorization';

const Settings = () => {
    const firebase = useContext(FirebaseContext);

    function signOut() {

        alertController.create({
            header: 'Sign Out !',
            subHeader: "Are you sure?",
            backdropDismiss: false,
            buttons: [{
                text: 'Yes',
                role: 'ok',
                cssClass: 'signout',
                handler: () => {
                    firebase.doSignOut();
                    // history.replace(ROUTE.signin);
                }
            },
            {
                text: 'No',
                role: 'cancel',
                cssClass: 'signout',
            }
            ]
        }).then(res => res.present());
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot='start'>
                        <IonBackButton/>
                    </IonButtons>
                    <IonTitle title="Settings">Settings</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className='ion-padding'>
                <div className="share ion-padding">
                    <IonButton color="success" expand='block' shape='round' onClick={e => {
                        navigator.share({
                            title: 'ChatBoi',
                            text: 'Support Local for Vocal \n Atmanirbhar Bharat initiative \n ChatBoi by xpJain ! \n Download via Link : \n https://chatboi.now.sh/share/chatboi.apk \n \n Website: \n',
                            url: 'https://chatboi.now.sh',
                        })
                    }}>
                        <IonIcon icon={shareSocial} />  
                        Share this</IonButton>

                </div>
                <div className="logout ion-padding">
                    <IonButton color="danger" expand='block' shape='round' onClick={signOut}>
                        <IonIcon icon={logOut}/>
                        Log Out</IonButton>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default withAuthorization(Settings)
