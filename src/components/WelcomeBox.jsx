import React from 'react'
import { AppString, appapk } from '../config/const'
import './welcome.css';
import { IonTitle, IonToolbar, IonHeader, IonContent, IonButtons, IonIcon, IonButton } from '@ionic/react';
import { shareSocial } from 'ionicons/icons';

const WelcomeBox = ({Installbtn}) => {
    let currentUser = {
        id: localStorage.getItem(AppString.ID),
        avatar: localStorage.getItem(AppString.PHOTO_URL),
        nickname: localStorage.getItem(AppString.NICKNAME),
    }
    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonTitle className='ion-text-center ion-text-capitalize'>ChatBox</IonTitle>
                    <IonButtons slot='end'>
                        <IonButton onClick={() => {
                            navigator.share({
                                title: 'ChatBoi',
                                text: 'ChatBoi by xpJain ! \n Download via Link : \n https://chatboi.now.sh/share/chatboi.apk \n \n Website: \n',
                                url: 'https://chatboi.now.sh',
                            })
                        }}>
                            <IonIcon icon={shareSocial}></IonIcon>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {/* <Installbtn/> */}
                <div className="viewWelcomeBoard">
                    <span className="textTitleWelcome">{`Welcome, ${
                        currentUser.nickname
                        }`}</span>
                    <img
                        className="avatarWelcome"
                        src={currentUser.avatar}
                        alt="icon avatar"
                    />
                    <span className="textDesciptionWelcome">
                        Let's start talking. Great things might happen.
                    </span>
                </div>
            </IonContent>
        </>
    )
}

export default WelcomeBox
