import React from 'react'
import { AppString } from '../config/const'
import './welcome.css';
import { IonTitle, IonToolbar, IonHeader, IonContent } from '@ionic/react';

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
